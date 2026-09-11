/**
 * Design token recipes — mirrors globals.css primitives.
 * Use these instead of arbitrary values in components.
 */

/** Spacing scale: 1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px */
export const space = {
  tight: 'gap-1',
  inline: 'gap-2',
  comfortable: 'gap-3',
  section: 'gap-4',
  loose: 'gap-6',
} as const;

export const pad = {
  control: 'px-3 py-2',
  surface: 'p-4',
  card: 'p-6',
  page: 'px-4 sm:px-6 lg:px-8',
} as const;

/** Width intents */
export const width = {
  content: 'max-w-screen-2xl',
  section: 'max-w-4xl',
  panel: 'max-w-3xl',
  prose: 'max-w-2xl',
  chart: 'max-w-xs',
  chartLarge: 'max-w-sm',
} as const;

/** Height / size intents */
export const size = {
  controlSm: 'h-8',
  control: 'h-9',
  controlLg: 'h-10',
  toolbar: 'h-14',
  iconSm: 'h-3 w-3',
  icon: 'h-4 w-4',
  key: 'h-8 w-8',
  keyLarge: 'h-10 w-10',
  cta: 'min-h-12 min-w-60',
  typingMin: 'min-h-48',
  detailStrip: 'min-h-16',
  chartCompact: 'max-h-32',
  chartDefault: 'max-h-36',
  chartLarge: 'max-h-48',
  fieldMin: 'min-h-16',
} as const;

/** Typography scale */
export const type = {
  caption: 'text-xs',
  bodySm: 'text-sm',
  body: 'text-base',
  bodyLg: 'text-lg',
  heading: 'text-xl sm:text-2xl',
  display: 'font-display text-4xl xs:text-5xl sm:text-5xl md:text-6xl',
  muted: 'text-xs sm:text-sm text-muted-foreground',
  mutedCaption: 'text-xs text-muted-foreground',
} as const;

/** Border radius — 3 tiers + pill */
export const radius = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

/** Elevation */
export const elevation = {
  none: 'shadow-none',
  surface: 'shadow',
  raised: 'shadow-md',
  overlay: 'shadow-xl',
} as const;

/** Motion */
export const motion = {
  easeOut: [0.23, 1, 0.32, 1] as const,
  durationFast: 0.15,
  durationUi: 0.2,
  durationModal: 0.25,
  transitionFast: 'transition-[transform,opacity] duration-fast ease-out',
  transitionUi: 'transition-[transform,opacity,box-shadow] duration-ui ease-out',
  transitionColors: 'transition-colors duration-fast',
} as const;
