/**
 * Favicon helper utilities with high-reliability fallbacks
 */

export function extractHostname(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || 'site';
  }
}

export function getFaviconUrl(url: string): string {
  const domain = extractHostname(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function getDomainInitials(url: string): string {
  const host = extractHostname(url);
  const parts = host.split('.');
  const name = parts[0] || 'W';
  return name.slice(0, 2).toUpperCase();
}

const BRAND_COLORS: Record<string, string> = {
  'github.com': 'bg-neutral-800 text-white',
  'mail.google.com': 'bg-red-950 text-red-200 border-red-800/40',
  'youtube.com': 'bg-red-950 text-red-200 border-red-800/40',
  'chatgpt.com': 'bg-emerald-950 text-emerald-200 border-emerald-800/40',
  'linkedin.com': 'bg-blue-950 text-blue-200 border-blue-800/40',
  'reddit.com': 'bg-orange-950 text-orange-200 border-orange-800/40',
  'x.com': 'bg-neutral-900 text-white border-neutral-700/40',
  'notion.so': 'bg-stone-900 text-stone-200 border-stone-700/40',
};

export function getBrandFallbackClass(url: string): string {
  const domain = extractHostname(url).toLowerCase();
  for (const [key, cls] of Object.entries(BRAND_COLORS)) {
    if (domain.includes(key.replace('.com', ''))) {
      return cls;
    }
  }
  return 'bg-cyan-950/70 text-cyan-200 border-cyan-800/40';
}
