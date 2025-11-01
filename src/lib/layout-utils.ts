/**
 * Common layout utility classes and patterns
 */

export const layoutClasses = {
  // Flex layouts
  flexCenter: 'flex items-center justify-center',
  flexCenterCol: 'flex flex-col items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center',
  flexCol: 'flex flex-col',

  // Responsive flex patterns
  responsiveFlex:
    'flex flex-col w-full justify-evenly items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4',
  responsiveFlexCol: 'flex flex-col xs:flex-row items-center gap-1 xs:gap-2',

  // Common spacing
  gap2: 'gap-2',
  gap4: 'gap-4',
  gapResponsive: 'gap-1 xs:gap-2',

  // Common padding/margin
  containerPadding: 'px-4 sm:px-6 md:px-8 lg:px-12',
  sectionSpacing: 'py-12 sm:py-16 md:py-20 lg:py-24',
} as const;

/**
 * Common text sizing patterns
 */
export const textClasses = {
  // Responsive text sizes
  heroTitle:
    'text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl',
  heroSubtitle: 'text-sm sm:text-base md:text-lg lg:text-xl',
  smallResponsive: 'text-xs sm:text-sm',

  // Common text combinations
  mutedSmall: 'text-xs sm:text-sm text-muted-foreground',
  mutedSubtle: 'text-xs text-muted-foreground',
} as const;

/**
 * Common button patterns
 */
export const buttonClasses = {
  // Primary CTA button
  primaryCta:
    'hover:scale-105 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 min-h-[48px] px-6 sm:px-8 text-base sm:text-lg font-semibold min-w-[240px]',

  // Action button with icon
  actionWithIcon: 'flex items-center gap-2',
} as const;

/**
 * Common layout shift prevention patterns
 */
export const layoutShiftClasses = {
  // Hero section content areas
  heroDescription:
    'min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem]',
  metricsReserved: 'min-h-[4rem] flex items-end justify-center mb-4',
  ctaSubtext: 'min-h-[2rem] flex items-center justify-center',

  // Common content containers
  heroContainer:
    'max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24 text-center',
  heroActions:
    'flex flex-col items-center justify-center relative gap-3 sm:gap-4 pt-8 sm:pt-10 md:pt-12 z-10',
} as const;

/**
 * Common feature list patterns
 */
export const featureClasses = {
  // Feature list container
  featureList:
    'flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm px-4 sm:px-0',

  // Individual feature item
  featureItem: 'flex items-center gap-2 text-muted-foreground/70',

  // Feature bullet point
  featureBullet:
    'w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground/30',
} as const;

/**
 * Common animation and transition patterns
 */
export const animationClasses = {
  // Loading spinner
  spinner: 'animate-spin rounded-full h-4 w-4 border-b-2 border-current',

  // Common transitions
  smoothTransition: 'transition-all duration-300',
  quickTransition: 'transition duration-200',

  // Hover effects
  hoverScale: 'hover:scale-105',
  hoverShadow: 'hover:shadow-lg hover:shadow-primary/25',
} as const;

/**
 * Common gradient patterns
 */
export const gradientClasses = {
  // Text gradients
  heroTextGradient:
    'bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400 dark:from-neutral-200 dark:to-neutral-500',
} as const;

/**
 * Utility function to combine layout classes
 */
export function combineLayoutClasses(
  ...classes: (keyof typeof layoutClasses)[]
): string {
  return classes.map((cls) => layoutClasses[cls]).join(' ');
}
