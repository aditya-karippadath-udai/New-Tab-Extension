// src/background/background.ts
var browserAPI = typeof chrome !== "undefined" ? chrome : globalThis.browser;
browserAPI?.runtime?.onInstalled?.addListener((details) => {
  console.log("[AuraTab] Extension installed/updated:", details.reason);
  if (details.reason === "install") {
    browserAPI?.storage?.local?.set({
      auratab_installed_at: Date.now(),
      auratab_version: "1.0.0"
    });
  }
  if (browserAPI?.contextMenus?.create) {
    try {
      browserAPI.contextMenus.removeAll(() => {
        browserAPI.contextMenus.create({
          id: "auratab-open-dashboard",
          title: "Open AuraTab Dashboard",
          contexts: ["action", "page"]
        });
        browserAPI.contextMenus.create({
          id: "auratab-search-selected",
          title: 'Search in AuraTab: "%s"',
          contexts: ["selection"]
        });
      });
    } catch (e) {
      console.warn("[AuraTab] Context menus setup note:", e);
    }
  }
});
browserAPI?.contextMenus?.onClicked?.addListener((info) => {
  if (info.menuItemId === "auratab-open-dashboard") {
    browserAPI.tabs.create({ url: browserAPI.runtime.getURL("index.html") });
  } else if (info.menuItemId === "auratab-search-selected" && info.selectionText) {
    const query = encodeURIComponent(info.selectionText);
    browserAPI.tabs.create({ url: `https://www.google.com/search?q=${query}` });
  }
});
browserAPI?.runtime?.onMessage?.addListener((request, sender, sendResponse) => {
  if (request?.type === "GET_EXTENSION_INFO") {
    sendResponse({
      name: "AuraTab",
      version: "1.0.0",
      browser: typeof globalThis.browser !== "undefined" ? "firefox" : "chromium"
    });
    return true;
  }
  if (request?.type === "OPEN_NEW_TAB") {
    browserAPI?.tabs?.create({ url: browserAPI.runtime.getURL("index.html") });
    sendResponse({ success: true });
    return true;
  }
});
