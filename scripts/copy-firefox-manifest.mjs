import fs from 'node:fs';
import path from 'node:path';

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(process.cwd(), 'firefox-dist');
const manifestSource = path.resolve(process.cwd(), 'manifests/firefox/manifest.json');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.copyFileSync(manifestSource, path.join(targetDir, 'manifest.json'));
console.log(`[AuraTab] Successfully copied Firefox Manifest V3 to ${targetDir}`);
