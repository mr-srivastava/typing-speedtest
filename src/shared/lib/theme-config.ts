import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';

export const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: DesktopIcon },
] as const;

export type Theme = (typeof THEME_OPTIONS)[number]['value'];

export const DEFAULT_THEME: Theme = 'dark';

export function getThemeOption(value: Theme) {
  const option = THEME_OPTIONS.find((entry) => entry.value === value);
  if (!option) {
    throw new Error(`Unknown theme: ${value}`);
  }
  return option;
}
