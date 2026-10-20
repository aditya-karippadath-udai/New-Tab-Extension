import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as viteBuild } from 'vite';
import * as esbuild from 'esbuild';
import { generateAllIcons } from './generate-icons.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targetArg = process.argv[2]?.toLowerCase();
const buildChrome = !targetArg || targetArg === 'chrome' || targetArg === 'all';
const buildFirefox = !targetArg || targetArg === 'firefox' || targetArg === 'all';

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function run() {
  console.log('====================================================');
  console.log('🚀 AuraTab Browser Extension Multi-Target Builder');
  console.log('   Targets:', [buildChrome && 'Chrome/Chromium (MV3)', buildFirefox && 'Mozilla Firefox (MV3)'].filter(Boolean).join(', '));
  console.log('====================================================\n');

  // Step 1: Generate PNG icons in public/icons
  console.log('📦 Step 1: Ensuring extension PNG icons exist...');
  const publicIconsDir = path.join(rootDir, 'public/icons');
  generateAllIcons(publicIconsDir);

  // Step 2: Bundle Frontend with Vite
  console.log('\n⚡ Step 2: Compiling multi-page Vite app (NewTab + Popup)...');
  await viteBuild({
    root: rootDir,
    configFile: path.join(rootDir, 'vite.config.ts'),
  });

  const distDir = path.join(rootDir, 'dist');

  // Step 3: Bundle background service worker with esbuild
  console.log('\n🛡️ Step 3: Compiling background service worker with esbuild...');
  const backgroundSrc = path.join(rootDir, 'src/background/background.ts');
  const backgroundOut = path.join(distDir, 'background.js');

  esbuild.buildSync({
    entryPoints: [backgroundSrc],
    outfile: backgroundOut,
    bundle: true,
    format: 'esm',
    target: 'es2022',
    minify: false,
    platform: 'browser',
  });
  console.log(`   Compiled background.js to ${backgroundOut}`);

  function cleanExtensionHtml(targetDir) {
    for (const file of ['index.html', 'popup.html']) {
      const filePath = path.join(targetDir, file);
      if (!fs.existsSync(filePath)) continue;
      let content = fs.readFileSync(filePath, 'utf-8');
      // Remove crossorigin attribute which triggers Firefox moz-extension:// CORS blocking
      content = content.replace(/\s+crossorigin(="[^"]*")?/gi, '');
      // Ensure relative paths for extension packages
      content = content.replace(/src="\/assets\//g, 'src="./assets/');
      content = content.replace(/href="\/assets\//g, 'href="./assets/');
      content = content.replace(/src="\/icons\//g, 'src="./icons/');
      content = content.replace(/href="\/icons\//g, 'href="./icons/');
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  }

  // Clean distDir HTML first
  cleanExtensionHtml(distDir);

  // Step 4: Build Chrome extension distribution
  if (buildChrome) {
    console.log('\n🌐 Step 4: Packaging chrome-dist/ (Manifest V3)...');
    const chromeDist = path.join(rootDir, 'chrome-dist');
    if (fs.existsSync(chromeDist)) {
      fs.rmSync(chromeDist, { recursive: true, force: true });
    }
    copyDirRecursive(distDir, chromeDist);
    cleanExtensionHtml(chromeDist);

    // Copy Chrome Manifest
    const chromeManifestSrc = path.join(rootDir, 'manifests/chrome/manifest.json');
    fs.copyFileSync(chromeManifestSrc, path.join(chromeDist, 'manifest.json'));

    console.log('   ✅ chrome-dist/ successfully packaged!');
  }

  // Step 5: Build Firefox extension distribution
  if (buildFirefox) {
    console.log('\n🦊 Step 5: Packaging firefox-dist/ (Manifest V3 with gecko ID)...');
    const firefoxDist = path.join(rootDir, 'firefox-dist');
    if (fs.existsSync(firefoxDist)) {
      fs.rmSync(firefoxDist, { recursive: true, force: true });
    }
    copyDirRecursive(distDir, firefoxDist);
    cleanExtensionHtml(firefoxDist);

    // Copy Firefox Manifest
    const firefoxManifestSrc = path.join(rootDir, 'manifests/firefox/manifest.json');
    fs.copyFileSync(firefoxManifestSrc, path.join(firefoxDist, 'manifest.json'));

    console.log('   ✅ firefox-dist/ successfully packaged!');
  }

  // Also copy a default manifest into dist/ so dist/ itself is also directly loadable
  fs.copyFileSync(path.join(rootDir, 'manifests/chrome/manifest.json'), path.join(distDir, 'manifest.json'));

  // Step 6: Verification & Summary
  console.log('\n====================================================');
  console.log('✨ Build Completed Successfully!');
  console.log('====================================================');

  if (buildChrome) {
    const chromeDist = path.join(rootDir, 'chrome-dist');
    const chromeFiles = fs.readdirSync(chromeDist);
    console.log(`📁 chrome-dist/ contains ${chromeFiles.length} top-level entries:`);
    console.log(`   - manifest.json (Chrome MV3)`);
    console.log(`   - index.html (New Tab override)`);
    console.log(`   - popup.html (Extension Action popup)`);
    console.log(`   - background.js (Service Worker)`);
    console.log(`   - icons/ (16, 32, 48, 128px PNGs)`);
    console.log(`   - assets/ (Bundled JS & CSS)`);
    console.log(`   👉 How to load: chrome://extensions -> Developer mode -> "Load unpacked" -> Select chrome-dist/`);
  }

  if (buildFirefox) {
    const firefoxDist = path.join(rootDir, 'firefox-dist');
    const firefoxFiles = fs.readdirSync(firefoxDist);
    console.log(`\n📁 firefox-dist/ contains ${firefoxFiles.length} top-level entries:`);
    console.log(`   - manifest.json (Firefox MV3 with gecko id)`);
    console.log(`   - index.html (New Tab override)`);
    console.log(`   - popup.html (Action popup)`);
    console.log(`   - background.js (Background script)`);
    console.log(`   - icons/ (16, 32, 48, 128px PNGs)`);
    console.log(`   - assets/ (Bundled JS & CSS)`);
    console.log(`   👉 How to load: about:debugging#/runtime/this-firefox -> "Load Temporary Add-on" -> Select firefox-dist/manifest.json`);
  }

  console.log('====================================================\n');
}

run().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
