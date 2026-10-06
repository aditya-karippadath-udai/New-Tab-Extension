/**
 * Cross-browser storage abstraction for Chrome/Chromium and Firefox extension APIs,
 * with seamless fallback to localStorage when running outside an extension.
 */

// Safe reference to browser or chrome API
declare const chrome: any;
declare const browser: any;

export const hasExtensionStorage = (): boolean => {
  if (typeof browser !== 'undefined' && browser?.storage?.local) {
    return true;
  }
  if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
    return true;
  }
  return false;
};

/**
 * Gets a value from extension storage or localStorage
 */
export async function getStorageItem<T>(key: string, defaultValue: T): Promise<T> {
  try {
    // 1. Firefox WebExtension API
    if (typeof browser !== 'undefined' && browser?.storage?.local?.get) {
      const res = await browser.storage.local.get(key);
      if (res && res[key] !== undefined) {
        return res[key] as T;
      }
    }
    // 2. Chrome Extension API (callbacks / promise in Manifest V3)
    else if (typeof chrome !== 'undefined' && chrome?.storage?.local?.get) {
      return new Promise<T>((resolve) => {
        chrome.storage.local.get([key], (result: Record<string, any>) => {
          if (chrome.runtime?.lastError) {
            console.warn('Chrome storage error:', chrome.runtime.lastError);
            resolve(defaultValue);
          } else if (result && result[key] !== undefined) {
            resolve(result[key] as T);
          } else {
            resolve(defaultValue);
          }
        });
      });
    }

    // 3. Fallback to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        return JSON.parse(raw) as T;
      }
    }
  } catch (err) {
    console.warn(`Failed to read "${key}" from storage:`, err);
  }

  return defaultValue;
}

/**
 * Saves a value to extension storage and localStorage
 */
export async function setStorageItem<T>(key: string, value: T): Promise<void> {
  try {
    // 1. Firefox WebExtension API
    if (typeof browser !== 'undefined' && browser?.storage?.local?.set) {
      await browser.storage.local.set({ [key]: value });
      return;
    }

    // 2. Chrome Extension API
    if (typeof chrome !== 'undefined' && chrome?.storage?.local?.set) {
      await new Promise<void>((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
          if (chrome.runtime?.lastError) {
            console.warn('Chrome storage set error:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
      return;
    }

    // 3. Fallback to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`Failed to write "${key}" to storage:`, err);
  }
}

/**
 * Removes a key from storage
 */
export async function removeStorageItem(key: string): Promise<void> {
  try {
    if (typeof browser !== 'undefined' && browser?.storage?.local?.remove) {
      await browser.storage.local.remove(key);
    } else if (typeof chrome !== 'undefined' && chrome?.storage?.local?.remove) {
      chrome.storage.local.remove([key]);
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    console.warn(`Failed to remove "${key}" from storage:`, err);
  }
}
