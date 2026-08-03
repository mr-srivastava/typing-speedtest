export const themeColors = {
  primary: 'hsl(var(--primary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  danger: 'hsl(var(--danger))',
  chart1: 'hsl(var(--chart-1))',
  chart2: 'hsl(var(--chart-2))',
  chart3: 'hsl(var(--chart-3))',
};

export const themeColorClasses = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  warningAnimated: 'text-warning animate-pulse',
  successBg: 'bg-success text-on-status',
  warningBg: 'bg-warning text-on-status',
  dangerBg: 'bg-danger text-on-status',
};

export const gradients = {
  primaryRadial:
    'bg-gradient-radial from-primary/20 via-transparent to-transparent',
  primaryLinear:
    'bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50',
  heroText:
    'bg-clip-text text-transparent bg-gradient-to-b from-foreground/70 to-muted-foreground',
};
