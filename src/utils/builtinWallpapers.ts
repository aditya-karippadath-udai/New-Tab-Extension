import { BuiltinWallpaper } from '../types';

import cosmicNebula from '../assets/images/wallpaper_cosmic_nebula_1791301560006.jpg';
import mountainDusk from '../assets/images/wallpaper_mountain_dusk_1791301579618.jpg';
import cyberMinimal from '../assets/images/wallpaper_cyber_minimal_1791301594221.jpg';
import natureForest from '../assets/images/wallpaper_nature_forest_1791301612168.jpg';

export const BUILTIN_WALLPAPERS: BuiltinWallpaper[] = [
  {
    id: 'cosmic_nebula',
    title: 'Deep Cosmic Nebula',
    category: 'Space',
    url: cosmicNebula,
  },
  {
    id: 'mountain_dusk',
    title: 'Twilight Ridge',
    category: 'Mountains',
    url: mountainDusk,
  },
  {
    id: 'cyber_minimal',
    title: 'Neo Obsidian Architecture',
    category: 'Cyberpunk',
    url: cyberMinimal,
  },
  {
    id: 'nature_forest',
    title: 'Nordic Pine Mist',
    category: 'Nature',
    url: natureForest,
  },
  {
    id: 'dark_obsidian',
    title: 'Obsidian Velvet',
    category: 'Dark',
    url: '',
    gradient: 'radial-gradient(circle at 50% 20%, #171d2b 0%, #090c14 60%, #030408 100%)',
  },
  {
    id: 'abstract_aurora',
    title: 'Quantum Aurora',
    category: 'Abstract',
    url: '',
    gradient: 'linear-gradient(135deg, #090c15 0%, #0f1f38 35%, #08293d 70%, #04121d 100%)',
  },
  {
    id: 'minimal_graphite',
    title: 'Graphite Grid',
    category: 'Minimal',
    url: '',
    gradient: 'linear-gradient(180deg, #12141a 0%, #090a0d 100%)',
  },
  {
    id: 'space_deep_void',
    title: 'Starlight Void',
    category: 'Space',
    url: '',
    gradient: 'radial-gradient(circle at top right, #1d1b38 0%, #0d0e1c 50%, #030408 100%)',
  },
  {
    id: 'cyber_synth',
    title: 'Midnight Synth',
    category: 'Cyberpunk',
    url: '',
    gradient: 'linear-gradient(120deg, #080718 0%, #150d30 40%, #051427 80%, #020610 100%)',
  },
  {
    id: 'abstract_lapis',
    title: 'Electric Lapis',
    category: 'Abstract',
    url: '',
    gradient: 'radial-gradient(ellipse at bottom, #072847 0%, #0c1429 55%, #05070f 100%)',
  },
];
