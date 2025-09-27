import { Platform } from '@/types';

export const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: 'WEB', label: 'Web' },
  { value: 'MOBILE', label: 'Mobile' },
  { value: 'DESKTOP', label: 'Desktop' },
  { value: 'API', label: 'API' },
  { value: 'IOS', label: 'iOS' },
  { value: 'ANDROID', label: 'Android' },
];

export const PLATFORM_DISPLAY_MAP = {
  WEB: 'Web',
  MOBILE: 'Mobile',
  DESKTOP: 'Desktop',
  API: 'API',
  IOS: 'iOS',
  ANDROID: 'Android',
} as const;

export function getPlatformDisplayName(platform: Platform): string {
  return PLATFORM_DISPLAY_MAP[platform] || platform;
}
