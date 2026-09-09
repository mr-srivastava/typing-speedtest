/**
 * Layout recipes composed from design tokens.
 */

import { elevation, pad, radius, space, type, width } from '@/shared/lib/tokens';

export const layoutClasses = {
  flexCenter: 'flex items-center justify-center',
  flexCenterCol: 'flex flex-col items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center',
  flexCol: 'flex flex-col',

  responsiveFlex:
    'flex flex-col w-full justify-evenly items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4',
  responsiveFlexCol: `flex flex-col xs:flex-row items-center ${space.tight} xs:gap-2`,

  containerPadding: pad.page,
  sectionSpacing: 'py-12 sm:py-16 md:py-20 lg:py-24',

  pageShell: 'h-dvh w-full bg-background relative flex flex-col antialiased overflow-hidden',
  contentShell: `mx-auto w-full ${width.content}`,

  /** @deprecated Use spaceClasses.inline */
  gap2: space.inline,
} as const;

/** @deprecated Use `radius` from tokens — kept for gradual migration */
export const radiusClasses = {
  control: radius.md,
  surface: radius.lg,
  card: radius.lg,
  panel: radius.lg,
  pill: radius.full,
} as const;

export { radius as radiusTokens, elevation as elevationClasses };

export const surfaceClasses = {
  field: `${radius.lg} bg-secondary/60 border border-border`,
} as const;

export const textClasses = {
  smallResponsive: `${type.caption} sm:${type.bodySm}`,
  mutedSmall: type.muted,
  mutedSubtle: type.mutedCaption,
} as const;

// Re-export spacing aliases used across the codebase
export const spaceClasses = space;
