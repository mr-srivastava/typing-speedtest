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

  // Shared page shell
  pageShell: 'h-dvh w-full bg-background relative flex flex-col antialiased overflow-hidden',
  contentShell: 'mx-auto w-full max-w-6xl',
} as const;

/**
 * Border radius scale
 */
export const radiusClasses = {
  control: 'rounded-md',
  surface: 'rounded-lg',
  card: 'rounded-xl',
  panel: 'rounded-2xl',
  pill: 'rounded-full',
} as const;

/**
 * Elevation / shadow scale
 */
export const elevationClasses = {
  surface: 'shadow',
  raised: 'shadow-md',
  overlay: 'shadow-xl',
} as const;

/**
 * Recurring surface styles (inputs, previews, stat bars)
 */
export const surfaceClasses = {
  field: `${radiusClasses.surface} bg-secondary/60 border border-border`,
} as const;

/**
 * Common text sizing patterns
 */
export const textClasses = {
  // Responsive text sizes
  heroTitle:
    'font-display text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl',
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
    'fine-hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 transition-[transform,box-shadow] duration-200 ease-out min-h-[48px] px-6 sm:px-8 text-base sm:text-lg font-semibold min-w-[240px]',

  // Action button with icon
  actionWithIcon: 'flex items-center gap-2',
} as const;

/**
 * Common layout shift prevention patterns
 */
export const layoutShiftClasses = {
  // Hero section content areas
  heroDescription:
    'min-h-[2rem] sm:min-h-[2.5rem]',
  metricsReserved: 'min-h-[3rem] flex items-end justify-center mb-2',
  ctaSubtext: 'min-h-[1.5rem] flex items-center justify-center',

  // Common content containers
  heroContainer:
    'max-w-4xl mx-auto w-full px-4 sm:px-6 text-center flex flex-col flex-1 min-h-0',
  heroActions:
    'flex flex-col items-center justify-center relative gap-2 sm:gap-3 pt-4 sm:pt-5 z-10',
} as const;

/**
 * Common animation and transition patterns
 */
export const animationClasses = {
  // Loading spinner
  spinner: 'animate-spin rounded-full h-4 w-4 border-b-2 border-current',

  // Common transitions
  smoothTransition: 'transition-[transform,opacity,box-shadow] duration-200 ease-out',
  quickTransition: 'transition-[transform,opacity] duration-200 ease-out',

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
    'bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-400 dark:from-neutral-200 dark:to-neutral-500',
} as const;
