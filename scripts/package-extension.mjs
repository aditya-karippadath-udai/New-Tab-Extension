import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const arg = process.argv[2]?.toLowerCase() || 'all';
const packageFirefox = arg === 'all' || arg === 'firefox' || arg === 'xpi';
const packageChrome = arg === 'all' || arg === 'chrome' || arg === 'zip';

/**
 * Creates a zip / xpi archive from a source directory.
 * Ensures files are stored at the root of the archive without a top-level parent folder.
 */
function createArchive(sourceDir, outputFile) {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source directory "${sourceDir}" does not exist. Run "npm run build" first.`);
  }

  const manifestPath = path.join(sourceDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`manifest.json missing in "${sourceDir}". Build might be incomplete.`);
  }

  // Remove existing output file if present
  if (fs.existsSync(outputFile)) {
    fs.rmSync(outputFile, { force: true });
  }

  const outDir = path.dirname(outputFile);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Strategy 1: Python 3 zipfile module (cross-platform, built-in on Linux & macOS)
  const pythonScript = `
import zipfile, os, sys

source_dir = sys.argv[1]
output_file = sys.argv[2]

with zipfile.ZipFile(output_file, 'w', compression=zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            full_path = os.path.join(root, file)
            # relative path inside the zip archive (root-level, no top-level folder)
            rel_path = os.path.relpath(full_path, source_dir)
            zipf.write(full_path, rel_path)
print("OK")
`;

  const pyResult = spawnSync('python3', ['-c', pythonScript, sourceDir, outputFile], {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (pyResult.status === 0 && fs.existsSync(outputFile)) {
    return;
  }

  // Strategy 2: System 'zip' command (Linux / macOS)
  const zipResult = spawnSync('zip', ['-r', '-FS', outputFile, '.'], {
    cwd: sourceDir,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (zipResult.status === 0 && fs.existsSync(outputFile)) {
    return;
  }

  // Strategy 3: Windows PowerShell Compress-Archive
  if (process.platform === 'win32') {
    const psCommand = `Compress-Archive -Path "${sourceDir}\\*" -DestinationPath "${outputFile}" -Force`;
    const psResult = spawnSync('powershell.exe', ['-NoProfile', '-Command', psCommand], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    if (psResult.status === 0 && fs.existsSync(outputFile)) {
      return;
    }
  }

  throw new Error(
    `Failed to package "${outputFile}". Neither python3, zip, nor PowerShell Compress-Archive succeeded.\n` +
    `Python error: ${pyResult.stderr || pyResult.error?.message || 'N/A'}\n` +
    `Zip error: ${zipResult.stderr || zipResult.error?.message || 'N/A'}`
  );
}

function verifyAndInspect(outputFile, label) {
  const stats = fs.statSync(outputFile);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`\n📦 ${label}:`);
  console.log(`   File: ${path.relative(rootDir, outputFile)}`);
  console.log(`   Size: ${sizeKb} KB (${stats.size.toLocaleString()} bytes)`);

  // Inspect entries via python if available
  const listScript = `
import zipfile, sys
with zipfile.ZipFile(sys.argv[1], 'r') as zipf:
    names = zipf.namelist()
    print(", ".join(names[:8]) + ("..." if len(names) > 8 else ""))
    if 'manifest.json' not in names:
        sys.exit(1)
`;
  const inspect = spawnSync('python3', ['-c', listScript, outputFile], { encoding: 'utf-8' });
  if (inspect.status === 0) {
    console.log(`   Contents: ${inspect.stdout.trim()}`);
    console.log(`   Root manifest.json verified: ✅ PASS`);
  }
}

async function main() {
  console.log('====================================================');
  console.log('📦 AuraTab Extension Packaging System');
  console.log('====================================================');

  const chromeDist = path.join(rootDir, 'chrome-dist');
  const firefoxDist = path.join(rootDir, 'firefox-dist');

  // If dist folders are missing, build them first
  if ((packageChrome && !fs.existsSync(chromeDist)) || (packageFirefox && !fs.existsSync(firefoxDist))) {
    console.log('⚡ Missing extension distribution builds. Running build first...');
    const buildScript = path.join(rootDir, 'scripts/build-extension.mjs');
    const buildRes = spawnSync('node', [buildScript], { stdio: 'inherit' });
    if (buildRes.status !== 0) {
      process.exit(1);
    }
  }

  const artifactsDir = path.join(rootDir, 'artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  if (packageFirefox) {
    console.log('\n🦊 Creating Firefox Add-on Package (.xpi)...');
    const xpiOut = path.join(artifactsDir, 'auratab-firefox.xpi');
    createArchive(firefoxDist, xpiOut);
    verifyAndInspect(xpiOut, 'Mozilla Firefox Add-on (.xpi)');

    // Also place a copy directly in root for easy user discovery
    const rootXpi = path.join(rootDir, 'auratab-firefox.xpi');
    fs.copyFileSync(xpiOut, rootXpi);
    console.log(`   🌟 Also generated root copy: ${path.basename(rootXpi)}`);
  }

  if (packageChrome) {
    console.log('\n🌐 Creating Chrome / Chromium ZIP Package (.zip)...');
    const zipOut = path.join(artifactsDir, 'auratab-chrome.zip');
    createArchive(chromeDist, zipOut);
    verifyAndInspect(zipOut, 'Chrome Web Store Package (.zip)');

    // Also place a copy directly in root
    const rootZip = path.join(rootDir, 'auratab-chrome.zip');
    fs.copyFileSync(zipOut, rootZip);
    console.log(`   🌟 Also generated root copy: ${path.basename(rootZip)}`);
  }

  console.log('\n====================================================');
  console.log('🎉 Packaging Complete!');
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('❌ Packaging failed:', err);
  process.exit(1);
});
