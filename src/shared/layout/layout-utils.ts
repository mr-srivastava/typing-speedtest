/**
 * Layout recipes composed from design tokens.
 */

import {
  elevation,
  motion,
  pad,
  radius,
  size,
  space,
  type,
  width,
} from '@/shared/lib/tokens';
import { gradients } from '@/shared/lib/theme';

export const layoutClasses = {
  flexCenter: 'flex items-center justify-center',
  flexCenterCol: 'flex flex-col items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center',
  flexCol: 'flex flex-col',

  responsiveFlex: 'flex flex-col w-full justify-evenly items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4',
  responsiveFlexCol: `flex flex-col xs:flex-row items-center ${space.tight} xs:gap-2`,

  containerPadding: pad.page,
  sectionSpacing: 'py-12 sm:py-16 md:py-20 lg:py-24',

  pageShell:
    'h-dvh w-full bg-background relative flex flex-col antialiased overflow-hidden',
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
  heroTitle: type.display,
  heroSubtitle: 'text-sm sm:text-base md:text-lg',
  smallResponsive: `${type.caption} sm:${type.bodySm}`,
  mutedSmall: type.muted,
  mutedSubtle: type.mutedCaption,
} as const;

export const buttonClasses = {
  heroCta: `${size.cta} px-6 sm:px-8 text-base sm:text-lg font-semibold`,
  primaryCta: `fine-hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 ${motion.transitionUi}`,
  actionWithIcon: `flex items-center ${space.inline}`,
} as const;

export const layoutShiftClasses = {
  heroDescription: 'min-h-8 sm:min-h-10',
  metricsReserved: `${size.detailStrip} flex items-end justify-center mb-2`,
  ctaSubtext: 'min-h-6 flex items-center justify-center',
  heroContainer: `${width.section} mx-auto w-full px-4 sm:px-6 text-center flex flex-col flex-1 min-h-0`,
  heroActions: `flex flex-col items-center justify-center relative ${space.inline} sm:${space.comfortable} pt-4 sm:pt-6 z-10`,
} as const;

export const animationClasses = {
  spinner: `animate-spin ${radius.full} ${size.icon} border-b-2 border-current`,
  smoothTransition: motion.transitionUi,
  quickTransition: motion.transitionFast,
  hoverScale: 'hover:scale-105',
  hoverShadow: 'hover:shadow-lg hover:shadow-primary/25',
} as const;

export const gradientClasses = {
  heroTextGradient: gradients.heroText,
} as const;

// Re-export spacing aliases used across the codebase
export const spaceClasses = space;
