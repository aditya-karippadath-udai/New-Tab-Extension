# AuraTab — Minimal Productivity New Tab & Browser Extension

AuraTab is a production-ready, privacy-first browser extension for **Google Chrome / Chromium / Brave / Edge** and **Mozilla Firefox**. It replaces your default New Tab screen with a fast, customizable productivity dashboard and includes a quick-access toolbar popup.

---

## ✨ Features

- **Dashboard & Productivity**:
  - **Customizable Clocks**: Choose between a modern digital clock and a sports-inspired **analog speedometer gauge clock** with live needles, tachometer ticks, and smooth sweep movements.
  - **Tree-Based Bookmark Explorer**: Complete hierarchical folder tree, instant filter search, drag-and-drop folder reorganization, inline bookmark creation/editing, and JSON export/import.
  - **Tasks & To-Do**: Fast inline task creation, priority badges (High/Medium/Low), due dates, completion checkoffs, and filter views.
  - **Interactive Calendar**: Month view with today navigation and date highlighting.
  - **Favourite Pages**: Quick-launch grid with automatic high-resolution favicon resolution and initial-badge fallbacks.
  - **Focus Timer & BrowserTime**: Integrated Pomodoro timer (25m work / 5m short break / 15m long break), synthesized Web Audio chime, and daily BrowserTime active minutes & session streak tracking.
  - **Omni-Search**: Unified search bar with engine switcher (Google, DuckDuckGo, Bing, Brave, Ecosia) and prefix quick routing (`!g`, `!d`, `!w`, `!gh`).
  - **Wallpaper Studio**: High-res cosmic, dusk mountain, cyber-minimal, and forest backgrounds, custom image uploads with IndexedDB persistence, CSS gradient studio, blur, and brightness adjustments.
  - **Personalized Header**: Custom user name configuration directly in settings with instant live preview.
  - **Theme Modes**: Deep obsidian dark glassmorphism and crisp light theme with 6 custom neon accent glows (Electric Blue, Neon Cyan, Cyber Violet, Mint, Amber, Rose).
- **Extension Toolbar Popup**:
  - Click the extension icon in your browser toolbar to view live time, quick search, toggle today's tasks, access bookmarks, and open the full New Tab dashboard with one click.
- **Background Service Worker**:
  - Handles extension lifecycle, context menu shortcuts ("Open AuraTab Dashboard" and "Search in AuraTab"), and cross-browser message routing.

---

## 🛠️ Project Structure

```text
├── public/
│   └── icons/                       # Extension icons (16, 32, 48, 128px PNG)
├── manifests/
│   ├── chrome/manifest.json         # Manifest V3 for Chrome / Chromium / Brave
│   └── firefox/manifest.json        # Manifest V3 for Mozilla Firefox (with Gecko ID)
├── src/
│   ├── newtab/
│   │   └── NewTabPage.tsx           # Full New Tab Dashboard entry
│   ├── popup/
│   │   ├── Popup.tsx                # Extension action popup interface
│   │   ├── PopupApp.tsx             # Context provider wrapper for popup
│   │   └── main.tsx                 # Popup DOM mount
│   ├── background/
│   │   └── background.ts            # Service worker / background script
│   ├── components/
│   │   ├── bookmarks/               # Tree, nodes, search, dialogs, toolbar
│   │   ├── widgets/                 # Clock, Speedometer, Tasks, Calendar, Search, Notes, FocusTimer
│   │   ├── settings/                # Appearance, Clocks, Widgets, Tasks, Search drawers
│   │   └── layout/                  # MainDashboard, BackgroundLayer, TopBar
│   ├── context/                     # SettingsContext, TasksContext, FavoritesContext, BookmarkContext
│   ├── storage/                     # browserStorage, indexedDbStorage, bookmarkStorage, taskStorage
│   ├── services/                    # browserTimeService, bookmarkService
│   └── types/                       # TypeScript models
├── scripts/
│   ├── build-extension.mjs          # Multi-target build script
│   ├── generate-icons.mjs           # Icon generation script
│   ├── copy-chrome-manifest.mjs     # Copy Chrome manifest
│   └── copy-firefox-manifest.mjs    # Copy Firefox manifest
├── index.html                       # New Tab HTML entry
├── popup.html                       # Extension Popup HTML entry
├── package.json
└── vite.config.ts
```

---

## 🚀 Building the Extension

Run the single unified build command:

```bash
npm run build
```

This compiles the project and generates two independent, complete extension packages:

- `chrome-dist/` — Ready to load into **Google Chrome, Chromium, Brave, Microsoft Edge, Vivaldi, Opera**.
- `firefox-dist/` — Ready to load into **Mozilla Firefox, LibreWolf, Floorp**.

### Target-specific builds:

```bash
# Build only Chrome
npm run build:chrome

# Build only Firefox
npm run build:firefox

# Development server
npm run dev
```

---

## 📥 How to Install & Test

### 1. Google Chrome / Chromium / Brave / Edge
1. Open your browser and navigate to `chrome://extensions/` (or `brave://extensions/`, `edge://extensions/`).
2. Toggle on **Developer mode** in the top right corner.
3. Click the **Load unpacked** button in the top left.
4. Select the `chrome-dist` folder located in this repository.
5. Open a new tab (`Ctrl + T` or `Cmd + T`) to see AuraTab!
6. Click the extension icon in your toolbar to test the Quick View popup.

### 2. Mozilla Firefox
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Browse into the `firefox-dist` directory and select either `manifest.json` or any file within `firefox-dist`.
4. Open a new tab (`Ctrl + T` or `Cmd + T`) to see AuraTab!
5. Click the extension icon in the Firefox toolbar to open the popup.

---

## 🔒 Privacy & Permissions

- **Zero Data Collection**: AuraTab operates entirely offline in your browser. No user telemetry, external tracking, or third-party servers.
- **Storage**: Uses `chrome.storage.local` / `browser.storage.local` with automatic fallback to `localStorage`. Large wallpaper images are stored efficiently in `IndexedDB`.
- **Bookmarks**: Uses native `chrome.bookmarks` API where permitted, with fallback to local persistent tree storage.
