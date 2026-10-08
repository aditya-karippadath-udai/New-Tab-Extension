/**
 * AuraTab Browser Extension - Service Worker / Background Script
 * Compatible with Chrome / Chromium Manifest V3 and Firefox Manifest V3
 */

declare const chrome: any;

// Cross-browser API accessor
const browserAPI: any = typeof chrome !== 'undefined' ? chrome : (globalThis as any).browser;

browserAPI?.runtime?.onInstalled?.addListener((details: { reason: string; previousVersion?: string }) => {
  console.log('[AuraTab] Extension installed/updated:', details.reason);

  // Set default initial extension flags if needed
  if (details.reason === 'install') {
    browserAPI?.storage?.local?.set({
      auratab_installed_at: Date.now(),
      auratab_version: '1.0.0',
    });
  }

  // Create context menu items if contextMenus API is available
  if (browserAPI?.contextMenus?.create) {
    try {
      browserAPI.contextMenus.removeAll(() => {
        browserAPI.contextMenus.create({
          id: 'auratab-open-dashboard',
          title: 'Open AuraTab Dashboard',
          contexts: ['action', 'page'],
        });

        browserAPI.contextMenus.create({
          id: 'auratab-search-selected',
          title: 'Search in AuraTab: "%s"',
          contexts: ['selection'],
        });
      });
    } catch (e) {
      console.warn('[AuraTab] Context menus setup note:', e);
    }
  }
});

// Context menu click listener
browserAPI?.contextMenus?.onClicked?.addListener((info: any) => {
  if (info.menuItemId === 'auratab-open-dashboard') {
    browserAPI.tabs.create({ url: browserAPI.runtime.getURL('index.html') });
  } else if (info.menuItemId === 'auratab-search-selected' && info.selectionText) {
    const query = encodeURIComponent(info.selectionText);
    browserAPI.tabs.create({ url: `https://www.google.com/search?q=${query}` });
  }
});

// Listen for messages from popup or new tab
browserAPI?.runtime?.onMessage?.addListener((request: any, sender: any, sendResponse: (res?: any) => void) => {
  if (request?.type === 'GET_EXTENSION_INFO') {
    sendResponse({
      name: 'AuraTab',
      version: '1.0.0',
      browser: typeof (globalThis as any).browser !== 'undefined' ? 'firefox' : 'chromium',
    });
    return true;
  }

  if (request?.type === 'OPEN_NEW_TAB') {
    browserAPI?.tabs?.create({ url: browserAPI.runtime.getURL('index.html') });
    sendResponse({ success: true });
    return true;
  }
});

export {};
