# 🌌 AuraTab — Minimal Productivity New Tab & Browser Extension

<div align="center">

<!-- Badges & Stickers Header -->
[![Manifest V3](https://img.shields.io/badge/Manifest-V3%20Native-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Firefox Add-on](https://img.shields.io/badge/Firefox%20Add--on-.xpi%20Ready-FF7139?style=for-the-badge&logo=firefoxbrowser&logoColor=white)](https://addons.mozilla.org/)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-.zip%20Ready-0F9D58?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![Edge & Brave](https://img.shields.io/badge/Chromium%20%7C%20Brave%20%7C%20Edge-Supported-blueviolet?style=for-the-badge&logo=brave&logoColor=white)](https://brave.com/)
[![React 19](https://img.shields.io/badge/React-v19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite 8](https://img.shields.io/badge/Vite-v8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Live Wallpaper](https://img.shields.io/badge/Live%20Wallpapers-IndexedDB%20Storage-FF007F?style=for-the-badge&logo=video&logoColor=white)](#-live-wallpaper-studio)
[![Dark Mode](https://img.shields.io/badge/Dark%20Mode-High%20Contrast%20Search-111111?style=for-the-badge&logo=moon&logoColor=white)](#-search-bar-high-contrast-dark-mode)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-Zero%20%7C%20100%25%20Offline-00E676?style=for-the-badge&logo=shield&logoColor=black)](#-privacy--security)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B.svg?style=for-the-badge)](./LICENSE)

<p align="center">
  <strong>A modern, privacy-first, ultra-responsive browser extension workspace that turns your default New Tab into an aesthetic productivity powerhouse.</strong>
</p>

<p align="center">
  <sub>Dual-target compilation pipeline with automated packaging for <strong>Google Chrome / Chromium / Brave / Edge</strong> (<code>.zip</code>) and <strong>Mozilla Firefox</strong> (<code>.xpi</code>).</sub>
</p>

</div>

---

## 📑 Table of Contents

- [✨ Feature Highlights](#-feature-highlights)
  - [🎬 Live Wallpaper Studio](#-live-wallpaper-studio)
  - [🌙 Search Bar High-Contrast Dark Mode](#-search-bar-high-contrast-dark-mode)
  - [🏎️ Speedometer & Digital Clocks](#️-speedometer--digital-clocks)
  - [🌲 Recursive Bookmark Explorer](#-recursive-bookmark-explorer)
  - [✅ Tasks & Focus Timers](#-tasks--focus-timers)
- [🏷️ Sticker Badges & Architecture Highlights](#️-sticker-badges--architecture-highlights)
- [📁 Project Structure](#-project-structure)
- [💻 Prerequisites & Environment](#-prerequisites--environment)
- [⚡ Quick Start & Development Server](#-quick-start--development-server)
- [🔨 How to Build the Project](#-how-to-build-the-project)
  - [1. Full Dual-Target Build (`npm run build`)](#1-full-dual-target-build-npm-run-build)
  - [2. Chrome-Only Build (`npm run build:chrome`)](#2-chrome-only-build-npm-run-buildchrome)
  - [3. Firefox-Only Build (`npm run build:firefox`)](#3-firefox-only-build-npm-run-buildfirefox)
  - [4. Build Pipeline Architecture & Internal Steps](#4-build-pipeline-architecture--internal-steps)
- [🦊 How to Create a Firefox `.xpi` File](#-how-to-create-a-firefox-xpi-file)
  - [Method 1: 1-Click NPM Packaging Script (Recommended)](#method-1-1-click-npm-packaging-script-recommended)
  - [Method 2: Command-Line ZIP Terminal Command](#method-2-command-line-zip-terminal-command)
  - [Method 3: Windows PowerShell `Compress-Archive`](#method-3-windows-powershell-compress-archive)
  - [Method 4: Mozilla Official `web-ext` CLI](#method-4-mozilla-official-web-ext-cli)
  - [Verification of `.xpi` File Structure](#verification-of-xpi-file-structure)
- [🌐 How to Create a Chrome Web Store `.zip` File](#-how-to-create-a-chrome-web-store-zip-file)
- [🧪 Step-by-Step Browser Testing Guide](#-step-by-step-browser-testing-guide)
  - [1. Google Chrome, Brave, Chromium & Microsoft Edge](#1-google-chrome-brave-chromium--microsoft-edge)
  - [2. Mozilla Firefox, LibreWolf & Floorp](#2-mozilla-firefox-librewolf--floorp)
  - [3. Permanent Testing in Firefox Developer Edition / Nightly](#3-permanent-testing-in-firefox-developer-edition--nightly)
- [📋 Comprehensive Manual Testing Checklist](#-comprehensive-manual-testing-checklist)
- [🛡️ Browser API & Cross-Platform Compatibility Layer](#️-browser-api--cross-platform-compatibility-layer)
- [🔒 Privacy & Security](#-privacy--security)
- [🔧 Troubleshooting & FAQ](#-troubleshooting--faq)
- [📜 License](#-license)

---

## ✨ Feature Highlights

AuraTab combines an aesthetic, customizable glassmorphic interface with high-utility daily driver widgets:

### 🎬 Live Wallpaper Studio
- **Curated High-Definition Ambient Loops**: Built-in cinematic live wallpapers including *Cyber Tokyo Rain*, *Deep Space Cosmic Drift*, *Misty Waterfall Forest*, and *Synthwave Sunset Highway*.
- **Import Your Own Live Wallpaper**: Drag & drop or upload local `.mp4`, `.webm`, or animated media directly from your machine.
- **IndexedDB Video Engine**: Custom imported videos are stored directly in browser IndexedDB chunks, bypassing the 5MB/10MB `chrome.storage` quota limits and avoiding data loss.
- **Controls & Adjustments**: Toggle audio mute, adjust backdrop blur (0px – 20px), brightness dimming (30% – 120%), and custom playback opacity.

### 🌙 Search Bar High-Contrast Dark Mode
- **Crisp High-Visibility Text**: Fixes common dark mode search contrast issues with explicit `#ffffff` pure-white input text, vibrant search icons, and high-contrast placeholder indicators (`placeholder:text-white/60`).
- **Multi-Engine Switching**: Instant single-click engine toggle between Google, DuckDuckGo, Bing, Brave, and Ecosia.
- **Bang Shortcuts**: Instant routing for developer bangs (`!g query`, `!d query`, `!gh repo`, `!w wikipedia`).

### 🏎️ Speedometer & Digital Clocks
- **Sports Car Analog Speedometer**: Sweep needle animations, calibrated tachometer hash tick marks, dual hour/minute dials, and an animated center seconds readout.
- **Modern Digital Clock**: Large readable glyphs with 12h/24h format toggling, date indicators, and custom greeting display (*"Good morning, Alex"*).

### 🌲 Recursive Bookmark Explorer
- **Unlimited Tree Nesting**: Create folders within folders to arbitrary depths (`Work ➔ Projects ➔ WebExtensions ➔ Docs`).
- **Instant Typeahead Filter**: Fast search filtering across the entire bookmark tree in real time.
- **Drag & Drop Reordering**: Move bookmarks and folders between hierarchy levels with visual drop feedback.
- **Safe Folder Deletion**: Safety confirmation modal displaying exact child item counts before deletion.
- **JSON Backup & Restore**: One-click JSON backup export and import for seamless cross-device migration.

### ✅ Tasks & Focus Timers
- **To-Do Planner**: Priority badges (High / Medium / Low), due date badges, inline task creation, and instant filter toggles.
- **Pomodoro Timer**: 25-minute work intervals with 5-minute short breaks and 15-minute long breaks.
- **Web Audio Sound Chimes**: Synthesized notification chimes rendered via pure Web Audio API oscillators—zero external MP3 dependencies.
- **BrowserTime Daily Tracker**: Tracks active focus sessions, daily streaks, and total productive minutes.

---

## 🏷️ Sticker Badges & Architecture Highlights

| Sticker Tag | Architecture Highlight | Description |
| :---: | :--- | :--- |
| `[🏷️ MV3-NATIVE]` | **Manifest V3 Native** | Uses Chrome Service Worker (`background.service_worker`) and Firefox MV3 background script specification. |
| `[⚡ DUAL-PIPELINE]` | **Unified Dual Compilation** | Single `npm run build` command outputs distinct `chrome-dist/` and `firefox-dist/` distributions simultaneously. |
| `[🦊 XPI-AUTOMATION]` | **Automated `.xpi` Packaging** | 1-command `.xpi` generator (`npm run package:xpi`) creating valid root-level Gecko PKZIP archives. |
| `[🎬 LIVE-WALLPAPERS]`| **IndexedDB Video Engine** | Chunked binary storage for user-imported 4K live video backgrounds without memory leaks or storage quota exhaustion. |
| `[🌙 OLED-CONTRAST]` | **High-Contrast Input Engine** | Deep dark mode styling ensuring search queries and inputs remain ultra-sharp and 100% visible across any background. |
| `[🏎️ TACHO-GAUGE]` | **Analog Speedometer Clock** | Calibrated SVG needle physics and radial hash marks rendering precision timekeeping in an analog gauge. |
| `[🌲 RECURSIVE-TREE]` | **Tree Bookmark Explorer** | Unlimited recursive nested hierarchy with real-time filtering, drag-and-drop mutations, and JSON export/import. |
| `[🔊 SYNTH-AUDIO]` | **Zero-Asset Web Audio** | Pure mathematical oscillator chime synthesis (`AudioContext` sine/triangle waveforms) with zero external sound files. |
| `[🔒 ZERO-LEAK]` | **100% Offline & Private** | Zero tracking, zero telemetry, zero third-party remote CDN dependencies at runtime. |

---

## 📁 Project Structure

```text
auratab/
├── artifacts/                       # 📦 Packaged distribution archives (Generated)
│   ├── auratab-firefox.xpi          # Mozilla Firefox ready-to-distribute Add-on
│   └── auratab-chrome.zip           # Chrome Web Store submission ZIP archive
├── chrome-dist/                     # 🚀 Unpacked Chrome / Brave / Edge extension (Generated)
│   ├── manifest.json                # Chrome MV3 manifest (service_worker, action popup, newtab override)
│   ├── index.html                   # New Tab dashboard entrypoint
│   ├── popup.html                   # Extension toolbar action popup
│   ├── background.js                # Compiled background service worker
│   ├── icons/                       # Scaled PNG icons (16px, 32px, 48px, 128px)
│   └── assets/                      # Minified JavaScript bundles, CSS, and preset media
├── firefox-dist/                    # 🦊 Unpacked Firefox extension (Generated)
│   ├── manifest.json                # Firefox MV3 manifest (background.scripts, Gecko Add-on ID)
│   ├── index.html                   # Firefox New Tab page
│   ├── popup.html                   # Firefox toolbar popup
│   ├── background.js                # Compiled background script
│   ├── icons/                       # PNG icons
│   └── assets/                      # Bundled assets
├── manifests/
│   ├── chrome/
│   │   └── manifest.json            # Base Chrome MV3 configuration
│   └── firefox/
│       └── manifest.json            # Base Firefox MV3 configuration (with gecko id)
├── public/
│   ├── icons/                       # Extension icon assets
│   └── favicon.png                  # Browser tab favicon
├── scripts/
│   ├── build-extension.mjs          # Dual-target compiler (Vite + esbuild + asset sanitization)
│   ├── package-extension.mjs        # Automated .xpi and .zip packager with root manifest verification
│   └── generate-icons.mjs           # Icon generator and scaler
├── src/
│   ├── background/
│   │   └── background.ts            # Extension service worker (context menus, tab events)
│   ├── components/
│   │   ├── bookmarks/               # Recursive tree, nodes, dialogs, search filter
│   │   ├── layout/                  # MainDashboard, TopBar, BackgroundLayer
│   │   ├── settings/                # Appearance, Clock, Widgets, Live Wallpapers, Search
│   │   ├── wallpaper/               # LiveWallpaperModal, LiveWallpaperEngine
│   │   └── widgets/                 # SpeedometerClock, DigitalClock, Tasks, FocusTimer, Calendar
│   ├── context/                     # SettingsContext, TasksContext, BookmarkContext, FavoritesContext
│   ├── storage/                     # browserStorage, wallpaperStorage (IndexedDB), taskStorage
│   └── types/                       # TypeScript interfaces and contracts
├── index.html                       # New Tab development & build entry
├── popup.html                       # Extension toolbar popup entry
├── package.json                     # Scripts, dependencies, and project metadata
├── tsconfig.json                    # TypeScript compiler options
└── vite.config.ts                   # Multi-page Vite configuration
```

---

## 💻 Prerequisites & Environment

Before building, verify that your development machine satisfies:

- **Node.js**: `v18.0.0` or higher (`v20.x` or `v22.x` recommended)
- **Package Manager**: `npm` (v9+), `pnpm` (v8+), or `bun`
- **Python 3** *(Optional, recommended for automated `.xpi` packaging)*: Preinstalled on Linux/macOS; on Windows available via Microsoft Store or python.org.
- **Tested Browsers**:
  - Google Chrome (v109+ for full MV3 support)
  - Chromium, Brave Browser, Microsoft Edge, Vivaldi, Opera, Arc
  - Mozilla Firefox (v115+ for MV3 support), Firefox Developer Edition, Firefox Nightly, LibreWolf, Floorp

Verify your Node.js and npm version in your terminal:

```bash
node --version
npm --version
```

---

## ⚡ Quick Start & Development Server

### 1. Install Dependencies

```bash
git clone https://github.com/your-username/auratab.git
cd auratab
npm install
```

### 2. Run the Interactive Web Development Server

To preview and iterate on the UI in a standard browser tab with instant Hot Module Reloading:

```bash
npm run dev
```

Navigate to `http://localhost:3000` in your web browser. AuraTab automatically detects that it is running in web mode and transparently routes all storage operations to `localStorage` and `IndexedDB`.

### 3. Type Checking & Linter

Run TypeScript checks to ensure zero type errors:

```bash
npm run lint
```

---

## 🔨 How to Build the Project

AuraTab features an automated dual-target build system. A single build execution compiles the TypeScript frontend with Vite, compiles the background service worker with esbuild, normalizes HTML paths, and produces complete distributions for both browser families.

### 1. Full Dual-Target Build (`npm run build`)

To build both Chrome and Firefox extensions simultaneously:

```bash
npm run build
```

#### What this command produces:
- `chrome-dist/` — Completely unpacked, loadable Chrome/Chromium/Brave/Edge extension.
- `firefox-dist/` — Completely unpacked, loadable Mozilla Firefox extension.
- `dist/` — Shared Vite compilation bundle.

---

### 2. Chrome-Only Build (`npm run build:chrome`)

If you are only working on Chrome, Brave, Chromium, or Microsoft Edge:

```bash
npm run build:chrome
```

This compiles the Vite assets, bundles `background.js`, and synchronizes `chrome-dist/` with `manifests/chrome/manifest.json`.

---

### 3. Firefox-Only Build (`npm run build:firefox`)

If you are specifically debugging Firefox or Gecko engine compatibility:

```bash
npm run build:firefox
```

This compiles the Vite assets, bundles `background.js`, sanitizes `<script>` tags by removing `crossorigin` attributes (which cause CORS rejections in Firefox `moz-extension://` contexts), and writes `firefox-dist/` with `manifests/firefox/manifest.json`.

---

### 4. Build Pipeline Architecture & Internal Steps

```text
┌───────────────────────────────┐
│  src/newtab/ & src/popup/     │ ──▶  Vite Multi-Page Build ──▶ dist/index.html & dist/popup.html
└───────────────────────────────┘                                    │
┌───────────────────────────────┐                                    │
│  src/background/background.ts │ ──▶  esbuild Standalone    ──▶ dist/background.js
└───────────────────────────────┘                                    │
┌───────────────────────────────┐                                    │
│  public/icons/ & Icon.png     │ ──▶  Icon Generator        ──▶ dist/icons/*.png
└───────────────────────────────┘                                    │
                                                                     ▼
                                                   ┌───────────────────────────────────┐
                                                   │ Clean & Strip Crossorigin Tags    │
                                                   │ (Ensures Firefox CORS Compliance) │
                                                   └───────────────────────────────────┘
                                                                     │
                                    ┌────────────────────────────────┴────────────────────────────────┐
                                    ▼                                                                 ▼
                         ┌──────────────────────┐                                          ┌──────────────────────┐
                         │     chrome-dist/     │                                          │    firefox-dist/     │
                         │   (Chrome MV3 JSON)  │                                          │  (Firefox MV3 JSON)  │
                         └──────────────────────┘                                          └──────────────────────┘
```

---

## 🦊 How to Create a Firefox `.xpi` File

### What is an `.xpi` file?
A Firefox Extension (`.xpi` — Cross-Platform Installer) is a standard **PKZIP archive** with an `.xpi` extension. 
> ⚠️ **CRITICAL RULE**: The `manifest.json` file **must be located at the absolute root of the zip archive**, NEVER nested inside a subfolder (e.g., `firefox-dist/manifest.json` inside the archive will fail with *"Corrupt Add-on"*).

---

### Method 1: 1-Click NPM Packaging Script (Recommended)

AuraTab includes a built-in packaging utility that packages and verifies your `.xpi` automatically:

```bash
# Package only the Firefox .xpi
npm run package:xpi

# OR package both Firefox .xpi and Chrome .zip simultaneously
npm run package
```

#### Output:
- `artifacts/auratab-firefox.xpi`
- `auratab-firefox.xpi` (convenient root copy)

The packaging script will automatically:
1. Verify `firefox-dist/` exists (and run `npm run build` if missing).
2. Archive all contents of `firefox-dist/` directly at the root.
3. Validate that `manifest.json` is at the root of the generated `.xpi`.
4. Output the exact package size and contents.

---

### Method 2: Command-Line ZIP Terminal Command

On **Linux** or **macOS**, you can build the project and package the `.xpi` using the standard `zip` command:

```bash
# 1. Build the extension
npm run build

# 2. Enter the firefox-dist directory
cd firefox-dist

# 3. Create the .xpi archive at the parent level
zip -r -FS ../auratab-firefox.xpi *

# 4. Return to project root
cd ..
```

*Note: The `-FS` flag synchronizes the zip archive, and running `zip` from inside `firefox-dist/` ensures `manifest.json` is at the root.*

---

### Method 3: Windows PowerShell `Compress-Archive`

On **Windows 10 / 11** using PowerShell:

```powershell
# 1. Build the extension
npm run build

# 2. Navigate into firefox-dist
Set-Location firefox-dist

# 3. Create the .xpi archive
Compress-Archive -Path * -DestinationPath ..\auratab-firefox.xpi -Force

# 4. Return to root
Set-Location ..
```

---

### Method 4: Mozilla Official `web-ext` CLI

You can also use Mozilla's official developer utility [`web-ext`](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) without installing it globally:

```bash
# 1. Build the project
npm run build

# 2. Run web-ext build against firefox-dist
npx web-ext build --source-dir=firefox-dist --artifacts-dir=artifacts --overwrite-dest
```

This outputs a validated `.zip` / `.xpi` directly into the `artifacts/` folder.

---

### Verification of `.xpi` File Structure

To verify your `.xpi` file was packed properly:

```bash
# Inspect archive contents
unzip -l auratab-firefox.xpi
```

Expected output structure:
```text
Archive:  auratab-firefox.xpi
  Length      Date    Time    Name
---------  ---------- -----   ----
      620  2026-10-21 14:00   manifest.json      <-- MUST BE AT ROOT!
     1670  2026-10-21 14:00   index.html
      960  2026-10-21 14:00   popup.html
    12400  2026-10-21 14:00   background.js
     5120  2026-10-21 14:00   icons/icon-128.png
     ...                      assets/...
```

---

## 🌐 How to Create a Chrome Web Store `.zip` File

For Google Chrome, Brave, or Microsoft Edge submission, create a clean `.zip` archive:

```bash
# Package only Chrome ZIP
npm run package:chrome

# OR package both Chrome .zip and Firefox .xpi
npm run package
```

Or manually via terminal:

```bash
cd chrome-dist
zip -r ../auratab-chrome.zip *
cd ..
```

This file is ready for direct upload to the **Chrome Web Store Developer Dashboard** and the **Microsoft Edge Add-ons Portal**.

---

## 🧪 Step-by-Step Browser Testing Guide

### 1. Google Chrome, Brave, Chromium & Microsoft Edge

Follow these steps to load AuraTab into Chromium-based browsers:

#### Step 1: Build the Extension
```bash
npm run build
```
Verify that the `chrome-dist/` directory exists and contains `manifest.json`.

#### Step 2: Open Extensions Management
- **Google Chrome**: Open `chrome://extensions/`
- **Brave Browser**: Open `brave://extensions/`
- **Microsoft Edge**: Open `edge://extensions/`

#### Step 3: Enable Developer Mode
In the top right corner of the Extensions page, toggle the **"Developer mode"** switch to **ON**.

```text
┌────────────────────────────────────────────────────────────────┐
│ Extensions                                  [Developer mode: ON] │
│                                                                │
│ [ Load unpacked ]  [ Pack extension ]  [ Update ]              │
└────────────────────────────────────────────────────────────────┘
```

#### Step 4: Load Unpacked Extension
1. Click the **"Load unpacked"** button in the top left toolbar.
2. In the folder picker dialog, select the **`chrome-dist`** directory inside the `auratab` folder.
3. Click **Select Folder**.

#### Step 5: Verify Extension Loading
- You will see the **AuraTab** card appear with version `1.0.0`, description, and permissions (`storage`, `contextMenus`, `bookmarks`).
- Click the puzzle piece icon (🧩) in the browser toolbar and click the **Pin** icon next to AuraTab.

#### Step 6: Test Features in Chrome
1. **New Tab Page**: Press <kbd>Ctrl</kbd> + <kbd>T</kbd> (or <kbd>Cmd</kbd> + <kbd>T</kbd> on macOS). AuraTab should immediately replace the default blank new tab!
2. **Toolbar Popup**: Click the pinned AuraTab icon in the top right browser bar. The mini action popup should display the current time, quick search, and active tasks.
3. **Background Worker**: On `chrome://extensions/`, find the AuraTab card and click **"Inspect views: service worker"** to view real-time logs from `background.js`.
4. **Context Menu**: Right-click anywhere on any webpage. Verify the menu item **"Open AuraTab Dashboard"** appears.
5. **Live Reloading during edits**: When you make code changes, run `npm run build` and simply click the **🔄 (Reload)** button on the AuraTab card in `chrome://extensions/`.

---

### 2. Mozilla Firefox, LibreWolf & Floorp

Follow these steps to load AuraTab into Mozilla Firefox:

#### Step 1: Build the Extension
```bash
npm run build
```

#### Step 2: Open Firefox Debugging Console
In the Firefox address bar, navigate to:
```text
about:debugging#/runtime/this-firefox
```

#### Step 3: Load the Temporary Add-on
1. Click the button labeled **"Load Temporary Add-on..."**.
2. A file selection dialog will appear.
3. You can select either:
   - The file `firefox-dist/manifest.json`
   - **OR** the generated `.xpi` file (`artifacts/auratab-firefox.xpi`)
4. Click **Open**.

```text
┌────────────────────────────────────────────────────────────────┐
│ This Firefox                                                   │
│                                                                │
│ [ Load Temporary Add-on... ]                                   │
│                                                                │
│ ▼ Temporary Extensions                                         │
│   🌌 AuraTab - Minimal Workspace                               │
│      Extension ID: auratab-workspace@auratab.local             │
│      Manifest URL: moz-extension://.../manifest.json           │
│      [ Inspect ] [ Reload ] [ Remove ]                         │
└────────────────────────────────────────────────────────────────┘
```

#### Step 4: Test Features in Firefox
1. **New Tab Page**: Press <kbd>Ctrl</kbd> + <kbd>T</kbd> (or <kbd>Cmd</kbd> + <kbd>T</kbd>). Firefox will ask *"An extension changed the page you see when opening a new tab. Keep changes?"* ➔ Click **"Keep Changes"**.
2. **Toolbar Action Popup**: Click the AuraTab icon in the Firefox navigation bar to open the fast toolbar popup.
3. **Inspect Background Script**: In `about:debugging#/runtime/this-firefox`, click the **"Inspect"** button on AuraTab to open the Firefox Developer Toolbox specifically attached to `background.js`.
4. **Reloading**: After making edits, re-run `npm run build` and click **"Reload"** under the AuraTab card in `about:debugging`.

---

### 3. Permanent Testing in Firefox Developer Edition / Nightly

Standard Firefox Release channels enforce signature verification and only allow temporary loading of unsigned `.xpi` files. If you want to install and keep the `.xpi` loaded permanently across browser restarts:

1. Use **Firefox Developer Edition** or **Firefox Nightly**.
2. In the address bar, open `about:config`.
3. Accept the warning prompt ("Accept the Risk and Continue").
4. Search for the preference:
   ```text
   xpinstall.signatures.required
   ```
5. Double-click it to toggle its value to **`false`**.
6. Open `about:addons`.
7. Click the gear icon (⚙️) at the top of the Add-ons manager and select **"Install Add-on From File..."**.
8. Select `auratab-firefox.xpi`.
9. Click **Add** on the confirmation prompt. The extension is now permanently installed!

---

## 📋 Comprehensive Manual Testing Checklist

Use this QA matrix to test every feature before packaging or releasing:

### 1. 🎬 Live Wallpaper Studio
- [ ] Open AuraTab New Tab page.
- [ ] Click the **"Live Wallpaper"** button in the top navigation bar.
- [ ] Select each preset: *Cyber Tokyo Rain*, *Deep Space Cosmic Drift*, *Misty Waterfall Forest*, *Synthwave Sunset Highway*.
- [ ] Verify the background video plays seamlessly in a loop without flickering.
- [ ] Click **"Import Live Wallpaper"** and upload a local `.mp4` or `.webm` video.
- [ ] Verify the custom video loads, begins playback, and shows an active checkmark badge.
- [ ] Toggle **Mute Audio** and verify volume settings.
- [ ] Refresh the page (<kbd>Ctrl + R</kbd> / <kbd>F5</kbd>). Verify the custom video persists and continues playing from IndexedDB storage.
- [ ] Click **"Switch to Static Wallpaper"** and verify graceful fallback.

### 2. 🌙 Search Bar & Dark Mode Text Visibility
- [ ] Toggle dark mode on (or select a dark/cosmic wallpaper).
- [ ] Click into the central search bar and type a search query (e.g., `modern web design`).
- [ ] **Crucial Check**: Verify that the typed text is clearly visible with high contrast (pure white text on dark glassy background).
- [ ] Verify the placeholder text is visible and legible.
- [ ] Click the search engine icon (Google) and switch to **DuckDuckGo**, **Brave**, **Bing**, or **Ecosia**. Verify the engine updates.
- [ ] Type `!gh vercel/next.js` and press <kbd>Enter</kbd>. Verify bang search redirects to GitHub.

### 3. 🏎️ Speedometer & Digital Clock
- [ ] Open Settings (⚙️ icon) ➔ **Clocks**.
- [ ] Select **Digital Clock**. Verify hours, minutes, seconds, AM/PM, and greeting display cleanly.
- [ ] Select **Speedometer Clock**.
  - [ ] Verify analog dials render with tachometer-style hash marks.
  - [ ] Verify the seconds needle sweeps smoothly in real time.
  - [ ] Verify hour and minute pointers match the exact current time.
  - [ ] Toggle **12-Hour vs 24-Hour** mode and check dial range updates.

### 4. 🌲 Bookmark Tree Explorer
- [ ] Click **+ Bookmark** at the root level and add a URL (e.g., `https://github.com`, Name: `GitHub`).
- [ ] Click **+ Folder** and create a folder named `Dev Tools`.
- [ ] Inside `Dev Tools`, create another nested subfolder `React Resources`.
- [ ] Drag `GitHub` into `React Resources`. Verify hierarchy updates immediately.
- [ ] Type `git` into the bookmark search bar. Verify real-time node filtering.
- [ ] Click **Export JSON** and save `auratab-bookmarks.json`.
- [ ] Delete a folder with contents and verify the deletion confirmation modal displays the correct item count.
- [ ] Click **Import JSON** and upload the exported file. Verify all bookmarks and folder structures are restored.

### 5. ✅ Tasks & Focus Timers
- [ ] Click **Add Task**, type a title, set priority to **High** (Red), and press Enter.
- [ ] Add tasks with **Medium** (Amber) and **Low** (Slate) priority.
- [ ] Check off a task: verify strikethrough styling and remaining counter decrement.
- [ ] In the Pomodoro widget, switch between **Pomodoro (25m)**, **Short Break (5m)**, and **Long Break (15m)**.
- [ ] Start the timer. Verify circular progress indicator and remaining time decrement each second.
- [ ] Let the timer complete (or test completion) and verify the synthesized audio chime plays cleanly.

### 6. 🧩 Toolbar Action Popup & Background Worker
- [ ] Click the AuraTab extension icon in your browser toolbar.
- [ ] Verify the action popup opens with current time, search bar, and active tasks.
- [ ] Check off a task directly inside the popup. Open the full New Tab and verify the task reflects as checked.
- [ ] Right-click anywhere on any web page. Click **"Open AuraTab Dashboard"** and verify a new tab opens to AuraTab.

---

## 🛡️ Browser API & Cross-Platform Compatibility Layer

AuraTab uses an adaptive browser abstraction layer that bridges Google Chrome and Mozilla Firefox:

```typescript
// Unified cross-browser namespace
export const browserAPI =
  typeof chrome !== 'undefined' && chrome.runtime
    ? chrome
    : typeof browser !== 'undefined'
      ? browser
      : null;
```

### Storage Cascade Architecture:
```text
┌────────────────────────────────────────────────────────┐
│              AuraTab Storage Request                   │
└────────────────────────────────────────────────────────┘
                           │
             Is Extension Runtime Available?
            ┌──────────────┴──────────────┐
           YES                            NO
            │                             │
  ┌───────────────────┐         ┌────────────────────┐
  │ chrome.storage    │         │ window.localStorage│
  │ or browser.storage│         │ (Web Dev Mode)     │
  └───────────────────┘         └────────────────────┘
            │
  Are we saving heavy video/wallpapers?
            │
            ▼
  ┌───────────────────┐
  │ IndexedDB         │  <-- Bypasses 5MB/10MB extension storage limits
  │ (AuraTabDB)       │      for high-res video loops & custom backgrounds
  └───────────────────┘
```

---

## 🔒 Privacy & Security

- **Zero Telemetry**: No remote analytic pings, Google Analytics, telemetry beacons, or user tracking.
- **100% Offline Capable**: All scripts, styles, icons, and fonts are local to the extension bundle.
- **No Remote Code Execution**: No `eval()`, `new Function()`, or dynamic remote script injection (strictly complies with Manifest V3 policies).
- **Minimal Required Permissions**:
  - `storage`: Saves user bookmarks, tasks, clock styles, and theme preferences.
  - `contextMenus`: Adds the optional right-click shortcut to open the dashboard.
  - `bookmarks`: Optional browser bookmark reading.

---

## 🔧 Troubleshooting & FAQ

#### Q: Firefox shows *"Corrupt Add-on"* when loading the `.xpi` file.
**A:** This happens if the `.xpi` was zipped with an enclosing folder (e.g. `firefox-dist/manifest.json` inside the archive). Use `npm run package:xpi` which guarantees that `manifest.json` is at the archive root.

#### Q: How do I test the extension without rebuilding every time?
**A:** Run `npm run dev` to develop the full app in your browser at `http://localhost:3000`. When you're ready to test extension-specific APIs (action popup, context menus, new tab override), run `npm run build` and click the reload button in `chrome://extensions` or `about:debugging`.

#### Q: Can I use 4K or 60FPS video files for my live wallpaper?
**A:** Yes! Custom live wallpapers are stored in browser-native `IndexedDB` (`AuraTabDB`). Large video files do not count toward your extension's `storage.sync` or `storage.local` quotas.

#### Q: What browsers are supported?
**A:** Any browser supporting Manifest V3:
- **Chromium**: Google Chrome, Brave, Microsoft Edge, Vivaldi, Opera, Arc.
- **Gecko**: Mozilla Firefox, Firefox Developer Edition, Firefox Nightly, LibreWolf, Floorp, Waterfox.

---

## 📜 License

This project is open-source software licensed under the **[MIT License](./LICENSE)**.

```text
Copyright (c) 2026 AuraTab Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">
  <sub>Built with ❤️ for speed, aesthetic focus, and zero-compromise privacy.</sub>
</div>
