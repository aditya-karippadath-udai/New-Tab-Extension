# 🌌 AuraTab — Minimal Productivity New Tab & Browser Extension

<div align="center">

<!-- Badges / Stickers -->
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Chrome Supported](https://img.shields.io/badge/Chrome%20%7C%20Edge%20%7C%20Brave-Supported-success?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.google.com/chrome/)
[![Firefox Supported](https://img.shields.io/badge/Mozilla%20Firefox-Supported-FF7139?style=for-the-badge&logo=firefoxbrowser&logoColor=white)](https://www.mozilla.org/firefox/)
[![React 19](https://img.shields.io/badge/React-v19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite 8](https://img.shields.io/badge/Vite-v8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg?style=for-the-badge)](./LICENSE)
[![Privacy First](https://img.shields.io/badge/Telemetry-Zero%20%7C%20100%25%20Offline-9cf?style=for-the-badge&logo=shield&logoColor=white)](#-privacy--security)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-purple.svg?style=for-the-badge)](#-contributing)

<p align="center">
  <strong>A modern, privacy-first, lightning-fast browser extension workspace that elevates your default New Tab into a focused productivity command center.</strong>
</p>

<p align="center">
  <sub>Dual-engine distribution with single-command compilation for <strong>Google Chrome / Chromium / Brave / Edge</strong> and <strong>Mozilla Firefox</strong>.</sub>
</p>

</div>

---

## 📑 Table of Contents

- [✨ Feature Highlights](#-feature-highlights)
- [🏷️ Sticker Badges & Architecture Highlights](#️-sticker-badges--architecture-highlights)
- [📁 Project Structure](#-project-structure)
- [💻 Prerequisites & Environment](#-prerequisites--environment)
- [⚡ Quick Start & Development Setup](#-quick-start--development-setup)
- [📦 Building the Extension (Dual-Target Pipeline)](#-building-the-extension-dual-target-pipeline)
  - [Build Everything (Chrome + Firefox)](#1-build-everything-chrome--firefox)
  - [Chrome-Only Build](#2-chrome-only-build)
  - [Firefox-Only Build](#3-firefox-only-build)
  - [Build Pipeline Internals](#4-build-pipeline-internals)
- [🧪 How to Install, Load & Test](#-how-to-install-load--test)
  - [Google Chrome, Brave, Chromium & Microsoft Edge](#1-google-chrome-brave-chromium--microsoft-edge)
  - [Mozilla Firefox, LibreWolf & Floorp](#2-mozilla-firefox-librewolf--floorp)
- [📋 Comprehensive Manual Testing Matrix](#-comprehensive-manual-testing-matrix)
- [🛡️ Browser API & Cross-Platform Compatibility Layer](#️-browser-api--cross-platform-compatibility-layer)
- [🔒 Privacy & Security](#-privacy--security)
- [🔧 Troubleshooting & FAQ](#-troubleshooting--faq)
- [📜 License](#-license)

---

## ✨ Feature Highlights

AuraTab combines aesthetic glassmorphic styling with high-performance utility widgets:

| Feature | Description |
| :--- | :--- |
| **🏎️ Speedometer & Digital Clocks** | Sports-car-inspired analog speedometer gauge with sweep needle, tachometer hashes, live seconds counter, alongside modern clean digital mode (12h/24h formats). |
| **🌲 Full Tree-Based Bookmark Explorer** | Unlimited recursive folder hierarchy, instant typeahead search filter, drag-and-drop reorganization, live URL favicons, folder expand/collapse, and JSON backup export/import. |
| **✅ Tasks & To-Do Planner** | Inline task entry, High/Medium/Low priority tags, due date tracking, animated checkoffs, task counts, and instant filter toggles. |
| **🍅 Pomodoro & BrowserTime** | 25m work / 5m short break / 15m long break timer with Web Audio synthesized chimes and daily active minutes & session streak tracking. |
| **🔍 Omni-Search Bar** | Multi-engine search switcher (Google, DuckDuckGo, Bing, Brave, Ecosia) with instant bang routing (`!g`, `!d`, `!w`, `!gh`). |
| **⭐ Quick-Launch Favorites** | Bookmark favorite apps with high-resolution favicon fetching, clean badges, custom labels, and direct navigation. |
| **📅 Interactive Calendar** | Month-grid calendar with quick date navigation, today highlighting, and clean layout integration. |
| **🎨 Wallpaper & Theme Studio** | High-res nature/dusk/cosmic wallpapers, custom image file upload with IndexedDB persistence, CSS gradient presets, blur & brightness tuning, and 6 neon accent colors. |
| **👤 Custom Personalized Greeting** | User name configuration in settings with instant live preview in the top dashboard navigation. |
| **🧩 Toolbar Quick-View Action Popup** | Clickable extension action icon popup providing time glance, quick web search, task checkoffs, top bookmarks, and 1-click dashboard opening. |
| **🛡️ Service Worker Background Script** | Manifest V3 background service worker providing browser context-menu actions ("Open AuraTab Dashboard", "Search in AuraTab") and cross-tab communication. |

---

## 🏷️ Sticker Badges & Architecture Highlights

| Sticker | Meaning | Implementation Detail |
| :---: | :--- | :--- |
| `[🏷️ MV3]` | **Manifest V3 Native** | Chrome service worker + Firefox background scripts using modern MV3 declarative configurations. |
| `[⚡ DUAL-DIST]` | **Dual Distribution** | One build command produces loadable `chrome-dist/` and `firefox-dist/` side-by-side. |
| `[🔒 ZERO-LEAK]` | **100% Offline & Private** | Zero telemetry, zero analytics tracking, zero third-party remote scripts. |
| `[💾 MULTI-STORE]` | **Tiered Storage Architecture** | `chrome.storage.local` ➔ `localStorage` fallback ➔ `IndexedDB` for high-resolution 4K custom wallpapers. |
| `[🌲 RECURSIVE-TREE]` | **Arbitrary-Depth Bookmarks** | Fully recursive tree explorer with drag-and-drop hierarchy adjustments and deletion safeguards. |
| `[🔊 WEB-AUDIO]` | **Pure Synthesized Sound** | Zero audio file dependencies; sounds are rendered programmatically via Web Audio API oscillators. |

---

## 📁 Project Structure

```text
├── chrome-dist/                     # 🚀 Production extension for Google Chrome / Brave / Edge (Generated)
├── firefox-dist/                    # 🦊 Production extension for Mozilla Firefox (Generated)
├── manifests/
│   ├── chrome/
│   │   └── manifest.json            # Chrome MV3 manifest (service_worker, action popup, newtab override)
│   └── firefox/
│       └── firefox.json             # Firefox MV3 manifest (background.scripts, Gecko add-on ID)
├── public/
│   └── icons/                       # Pixel-perfect PNG icons (16x16, 32x32, 48x48, 128x128)
├── scripts/
│   ├── build-extension.mjs          # Orchestrates dual-target build, Vite bundling, esbuild & packaging
│   ├── generate-icons.mjs           # Canvas-based procedural icon generator
│   ├── copy-chrome-manifest.mjs     # Standalone helper for Chrome manifest copy
│   └── copy-firefox-manifest.mjs    # Standalone helper for Firefox manifest copy
├── src/
│   ├── background/
│   │   └── background.ts            # Extension service worker (context menus, lifecycle)
│   ├── newtab/
│   │   └── NewTabPage.tsx           # Full-screen New Tab workspace page component
│   ├── popup/
│   │   ├── main.tsx                 # Extension toolbar action popup DOM root
│   │   ├── PopupApp.tsx             # Context wrapper for extension popup
│   │   └── Popup.tsx                # Fast action toolbar popup UI
│   ├── components/
│   │   ├── bookmarks/               # Tree, nodes, dialogs, toolbar, empty state, search
│   │   ├── widgets/                 # Clocks, Speedometer, Tasks, Calendar, Notes, FocusTimer
│   │   ├── settings/                # Appearance, Clock, Widgets, Tasks, Search configuration
│   │   └── layout/                  # MainDashboard, TopBar, BackgroundLayer
│   ├── context/                     # SettingsContext, TasksContext, FavoritesContext, BookmarkContext
│   ├── storage/                     # browserStorage, bookmarkStorage, taskStorage, indexedDbStorage
│   ├── services/                    # browserApi, browserTimeService, bookmarkService
│   └── types/                       # Strict TypeScript models
├── index.html                       # New Tab entrypoint (Vite multi-page input)
├── popup.html                       # Toolbar action popup entrypoint (Vite multi-page input)
├── LICENSE                          # MIT Open Source License
├── package.json                     # Scripts, dependencies, and metadata
├── tsconfig.json                    # TypeScript compiler options
└── vite.config.ts                   # Multi-page build configuration
```

---

## 💻 Prerequisites & Environment

Before building or developing, ensure your local environment satisfies:

- **Node.js**: `v18.0.0` or higher (`v20.x` or `v22.x` recommended)
- **Package Manager**: `npm` (v9+), `pnpm` (v8+), or `bun`
- **Supported Browsers**:
  - Google Chrome (version 109+ for full MV3 support)
  - Chromium, Brave, Microsoft Edge, Vivaldi, Opera, Arc
  - Mozilla Firefox (version 115+ for MV3 support), LibreWolf, Floorp

Verify your Node installation:

```bash
node --version
npm --version
```

---

## ⚡ Quick Start & Development Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/auratab.git
cd auratab

# Install all dependencies
npm install
```

### 2. Local Development Server

To preview and develop the New Tab dashboard in your standard web browser with instant hot-reloading:

```bash
npm run dev
```

Open your browser at `http://localhost:3000` to interact with AuraTab in web mode. The storage layer automatically falls back to `localStorage` and `IndexedDB` when running outside an extension runtime.

### 3. Lint & Type Check

To ensure pristine TypeScript code quality with zero compiler warnings:

```bash
npm run lint
```

---

## 📦 Building the Extension (Dual-Target Pipeline)

AuraTab features an automated build system that bundles the React application, compiles the TypeScript background service worker, renders all icon resolutions, and packages both Chrome and Firefox extensions.

### 1. Build Everything (Chrome + Firefox)

```bash
npm run build
```

This single command:
1. Runs `scripts/generate-icons.mjs` to ensure 16px, 32px, 48px, and 128px icons are generated in `public/icons/`.
2. Invokes **Vite** to compile `index.html` (New Tab) and `popup.html` (Toolbar Action Popup) with minified chunks and CSS.
3. Invokes **esbuild** to compile `src/background/background.ts` into a standalone, unbundled `background.js` compatible with both Chrome's service worker runtime and Firefox's background script runner.
4. Packages `chrome-dist/` with Chrome Manifest V3.
5. Packages `firefox-dist/` with Firefox Manifest V3 (including `browser_specific_settings.gecko.id`).

Output verification:
- `chrome-dist/` — Contains complete unpacked Chrome extension.
- `firefox-dist/` — Contains complete unpacked Firefox extension.

### 2. Chrome-Only Build

If you are only iterating on Chrome, Chromium, Brave, or Microsoft Edge:

```bash
npm run build:chrome
```

### 3. Firefox-Only Build

If you are specifically debugging Firefox or Gecko compatibility:

```bash
npm run build:firefox
```

### 4. Build Pipeline Internals

```text
┌─────────────────┐       ┌────────────────────────┐
│  src/newtab/*   │ ───▶  │  Vite Multi-Page Build │ ───▶  dist/index.html & dist/assets/*
│  src/popup/*    │ ───▶  │  (Rollup / PostCSS)    │ ───▶  dist/popup.html
└─────────────────┘       └────────────────────────┘
                                                               │
┌─────────────────┐       ┌────────────────────────┐          │
│ background.ts   │ ───▶  │  esbuild Fast Bundler  │ ───▶  dist/background.js
└─────────────────┘       └────────────────────────┘          │
                                                               │
┌─────────────────┐       ┌────────────────────────┐          │
│ SVG Icon Canvas │ ───▶  │  generate-icons.mjs    │ ───▶  dist/icons/*.png
└─────────────────┘       └────────────────────────┘          │
                                                               ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │          Assemble & Copy Extension Bundles              │
                     └─────────────────────────────────────────────────────────┘
                                  │                                   │
                                  ▼                                   ▼
                       ┌──────────────────────┐           ┌──────────────────────┐
                       │     chrome-dist/     │           │    firefox-dist/     │
                       │   (Chrome MV3 JSON)  │           │  (Firefox MV3 JSON)  │
                       └──────────────────────┘           └──────────────────────┘
```

---

## 🧪 How to Install, Load & Test

Follow these exact steps to load AuraTab into your browser of choice:

### 1. Google Chrome, Brave, Chromium & Microsoft Edge

1. **Build the extension**:
   ```bash
   npm run build
   ```
2. **Open Extensions Page**:
   - In Chrome: navigate to `chrome://extensions/`
   - In Brave: navigate to `brave://extensions/`
   - In Edge: navigate to `edge://extensions/`
3. **Enable Developer Mode**:
   - Toggle the switch labeled **Developer mode** in the top right corner.
4. **Load the Unpacked Folder**:
   - Click the **"Load unpacked"** button in the upper left header.
   - In the file dialog, browse to your project root and select the **`chrome-dist`** directory.
5. **Verify Extension Presence**:
   - AuraTab should appear with its icon, version number (`1.0.0`), and description.
6. **Test the New Tab**:
   - Press <kbd>Ctrl</kbd> + <kbd>T</kbd> (or <kbd>Cmd</kbd> + <kbd>T</kbd> on macOS) to open a new tab. AuraTab will greet you!
7. **Test the Extension Action Popup**:
   - Pin the AuraTab icon to your browser toolbar.
   - Click the icon to view the Quick-Access toolbar popup.

---

### 2. Mozilla Firefox, LibreWolf & Floorp

1. **Build the extension**:
   ```bash
   npm run build
   ```
2. **Open Debugging Page**:
   - In Firefox: navigate to `about:debugging#/runtime/this-firefox`
3. **Load Temporary Add-on**:
   - Click the button **"Load Temporary Add-on..."**.
   - Browse into the **`firefox-dist`** directory.
   - Select the `manifest.json` file inside `firefox-dist/`.
4. **Verify Add-on Installation**:
   - The add-on will register under *Temporary Extensions* with Extension ID: `auratab-workspace@auratab.local`.
5. **Test the New Tab**:
   - Press <kbd>Ctrl</kbd> + <kbd>T</kbd> (or <kbd>Cmd</kbd> + <kbd>T</kbd> on macOS). AuraTab opens immediately as your new tab page.
6. **Test Toolbar Popup**:
   - Click the AuraTab icon in the Firefox browser toolbar to verify the quick popup view.

---

## 📋 Comprehensive Manual Testing Matrix

Use this step-by-step checklist to perform end-to-end quality assurance on all features:

### 1. 🕒 Clock & Speedometer Testing
- [ ] **Digital Mode**: Open Settings ➔ Clocks ➔ Switch to *Digital Clock*. Verify hours, minutes, seconds, AM/PM, and date indicators render smoothly.
- [ ] **Speedometer Gauge Mode**: Switch to *Speedometer Clock*.
  - [ ] Verify analog dials show Hours, Minutes, and Seconds with calibrated hash tick marks.
  - [ ] Verify smooth second needle animation.
  - [ ] Verify central digital readout matches the analog needle angles.
  - [ ] Toggle 12-hour vs 24-hour mode and verify gauge markings update accordingly.

### 2. 🌲 Bookmark Tree Explorer Testing
- [ ] **Root Additions**: Click `+ Bookmark` or `+ Folder` at the root level.
- [ ] **Recursive Nesting**: Create a nested folder (e.g. `Development ➔ Frontend ➔ React`). Confirm arbitrary depth nesting works without limit.
- [ ] **Live Search**: Enter search keywords in the Bookmark search bar. Confirm nodes filter instantly in real-time.
- [ ] **Drag & Drop**: Drag a bookmark or folder into another folder. Verify hierarchy updates and persists upon reload.
- [ ] **Deletion Confirmation**: Delete a non-empty folder. Confirm the safety modal displays the child count and requires explicit confirmation before removal.
- [ ] **Export & Import**: Export bookmarks as JSON. Delete a node, then import the JSON file to confirm restoration.

### 3. ✅ Tasks & To-Do List Testing
- [ ] **Task Creation**: Add a task (e.g., "Deploy extension to Chrome Web Store") with priority set to **High**.
- [ ] **Priority Badges**: Check that Red (High), Amber (Medium), and Slate (Low) badges display accurately.
- [ ] **Task Completion**: Click the checkmark circle. Ensure task styles update with a strikethrough.
- [ ] **Task Counts**: Verify the task count badge reflects remaining pending tasks.
- [ ] **Persistence**: Refresh the page (<kbd>Ctrl + R</kbd>) and verify all tasks remain intact.

### 4. 🍅 Pomodoro Focus Timer & BrowserTime Testing
- [ ] **Mode Switching**: Toggle between 25m Pomodoro, 5m Short Break, and 15m Long Break.
- [ ] **Timer Countdown**: Click Play. Verify the countdown decrements every second and circular progress stroke updates.
- [ ] **Audio Chime**: Let the timer complete or test completion. Verify the synthesized Web Audio chime plays cleanly without audio file lag.
- [ ] **BrowserTime Tracking**: Check daily stats to verify active minutes, sessions completed, and daily streak counters update.

### 5. 🔍 Omni-Search Bar Testing
- [ ] **Engine Switching**: Switch the active search engine between Google, DuckDuckGo, Bing, Brave, and Ecosia.
- [ ] **Bang Shortcuts**: Test bang prefixes (`!g query`, `!d query`, `!gh repo`). Confirm you are redirected to the respective search engine.

### 6. 🎨 Wallpaper & Styling Studio Testing
- [ ] **Preset Wallpapers**: Cycle through Cosmic Nebula, Mountain Dusk, Cyber Minimal, and Nature Forest backgrounds.
- [ ] **Custom File Upload**: Upload a local high-resolution PNG/JPG. Verify the image loads and is stored in `IndexedDB`.
- [ ] **Gradient Studio**: Switch to Gradient mode and select presets (Midnight Blue, Aurora Neon, Obsidian Sunset).
- [ ] **Sliders**: Adjust blur (0px – 20px) and brightness (30% – 120%) sliders and verify immediate CSS backdrop response.
- [ ] **Accent Colors**: Switch accent color (Electric Blue, Cyan, Violet, Emerald, Amber, Rose) and verify all button glows update.

### 7. 👤 User Name Personalization Testing
- [ ] Open Settings ➔ Appearance.
- [ ] Change the User Name from default to your name (e.g., "Alex").
- [ ] Verify the TopBar header greeting updates immediately (e.g., *"Good morning, Alex"*).

### 8. 🧩 Toolbar Action Popup Testing
- [ ] Click the AuraTab icon in the browser toolbar.
- [ ] Verify time and date render correctly in the popup header.
- [ ] Perform a quick search from the popup input.
- [ ] Check off a pending task directly in the popup and open the New Tab dashboard with the *"Open Full Dashboard"* link.

### 9. 🛡️ Background Service Worker Testing
- [ ] Right-click anywhere on any web page.
- [ ] Verify the context menu item **"Open AuraTab Dashboard"** appears.
- [ ] Click it and confirm a new tab opens to AuraTab.

---

## 🛡️ Browser API & Cross-Platform Compatibility Layer

AuraTab abstracts browser discrepancies into a unified API layer located in `src/services/browser/` and `src/storage/`:

```typescript
// Unified API accessor
export const browserAPI =
  typeof chrome !== 'undefined' && chrome.runtime
    ? chrome
    : typeof browser !== 'undefined'
      ? browser
      : null;
```

### Storage Cascade:
1. **Extension Storage**: Prefers `chrome.storage.local` or `browser.storage.local` with asynchronous promise wrappers.
2. **Local Fallback**: Automatically falls back to standard `localStorage` when running in web preview / development mode.
3. **High-Res Media**: Dedicated `IndexedDB` key-value store for storing large user-uploaded wallpapers to prevent `storage.local` quota exceedance.

---

## 🔒 Privacy & Security

- **No Remote Telemetry**: AuraTab does not send analytics, telemetry, or user behavior logs anywhere.
- **Offline First**: All scripts, styles, and fonts are compiled locally into the extension package.
- **No Third-Party CDNs at Runtime**: All assets reside in `assets/` and `public/icons/`.
- **Minimal Permissions**:
  - `storage`: Required to save your settings, tasks, bookmarks, and wallpaper preferences.
  - `bookmarks`: Optional browser bookmark integration.
  - `contextMenus`: Provides the right-click quick navigation shortcut.

---

## 🔧 Troubleshooting & FAQ

#### Q: How do I reload changes after modifying code?
Run `npm run build`. Then:
- **In Chrome**: Go to `chrome://extensions/` and click the 🔄 reload icon on the AuraTab card.
- **In Firefox**: Go to `about:debugging#/runtime/this-firefox` and click **Reload** under AuraTab.

#### Q: Can I run AuraTab as a regular website?
Yes! Run `npm run dev` and open `http://localhost:3000`. AuraTab detects standard browser environments and seamlessly uses `localStorage` and `IndexedDB`.

#### Q: Where are custom uploaded wallpapers stored?
Custom wallpapers are saved in browser-native `IndexedDB` under the database `AuraTabDB`. This avoids the 5MB/10MB limits of standard extension storage.

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
...
```

---

<div align="center">
  <sub>Built with ❤️ for productivity, speed, and privacy.</sub>
</div>
