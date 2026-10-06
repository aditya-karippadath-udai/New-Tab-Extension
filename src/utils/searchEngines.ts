import { SearchEngine, SearchEngineId } from '../types';

export const SEARCH_ENGINES: Record<SearchEngineId, SearchEngine> = {
  google: {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    placeholder: 'Search Google or type a URL...',
    iconName: 'google',
  },
  duckduckgo: {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    placeholder: 'Search privately with DuckDuckGo...',
    iconName: 'duckduckgo',
  },
  bing: {
    id: 'bing',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    placeholder: 'Search Bing or enter address...',
    iconName: 'bing',
  },
  brave: {
    id: 'brave',
    name: 'Brave Search',
    url: 'https://search.brave.com/search?q=',
    placeholder: 'Search with Brave...',
    iconName: 'brave',
  },
  ecosia: {
    id: 'ecosia',
    name: 'Ecosia',
    url: 'https://www.ecosia.org/search?q=',
    placeholder: 'Search the web to plant trees...',
    iconName: 'ecosia',
  },
};

export const QUICK_SHORTCUTS = [
  { prefix: 'gh:', label: 'GitHub', engine: 'https://github.com/search?q=' },
  { prefix: 'yt:', label: 'YouTube', engine: 'https://www.youtube.com/results?search_query=' },
  { prefix: 'r/', label: 'Reddit', engine: 'https://www.reddit.com/search/?q=' },
  { prefix: 'wiki:', label: 'Wikipedia', engine: 'https://en.wikipedia.org/wiki/Special:Search?search=' },
  { prefix: 'npm:', label: 'npm', engine: 'https://www.npmjs.com/search?q=' },
];
