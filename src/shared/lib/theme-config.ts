import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';

export const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: DesktopIcon },
] as const;

export type Theme = (typeof THEME_OPTIONS)[number]['value'];

export const DEFAULT_THEME: Theme = 'dark';

export const ENABLE_SYSTEM = THEME_OPTIONS.some(
  (option) => option.value === 'system',
);

export const [lightThemeOption, darkThemeOption] = THEME_OPTIONS;
