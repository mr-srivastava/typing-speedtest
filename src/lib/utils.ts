import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme colors - using CSS custom properties from globals.css
export const themeColors = {
  primary: 'hsl(var(--primary))',
  good: 'hsl(var(--good))',
  poor: 'hsl(var(--poor))',
  needsImprovement: 'hsl(var(--needs-improvement))',
};

export const themeColorClasses = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning animate-pulse',
  goodBg: 'bg-success',
  poorBg: 'bg-warning',
  needsImprovementBg: 'bg-danger',
};

export const pieChartColors = [
  'hsl(var(--good))',
  'hsl(var(--needs-improvement))',
];

// Gradients
export const gradients = {
  primaryRadial:
    'bg-gradient-radial from-primary/20 via-transparent to-transparent',
  primaryLinear:
    'bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50',
};

// Chart configurations
export const wpmChartConfig = {
  value: 200, // Max WPM value for chart
  showPercentage: false,
  feedbackThresholds: { excellent: 80, average: 40 },
  feedbackMessages: {
    excellent: "Excellent! You're typing like a pro.",
    average: 'Good speed! Keep practicing to improve.',
    belowAverage: 'Focus on building up your speed.',
  },
  averageInfo: 'The average typing speed is around 40 WPM.',
  fillColor: 'hsl(var(--success))',
};

export const accuracyChartConfig = {
  value: 100, // Max accuracy percentage
  showPercentage: true,
  feedbackThresholds: { excellent: 95, average: 90 },
  feedbackMessages: {
    excellent: 'Excellent! Your accuracy is top-notch.',
    average: "Keep practicing! You're close to average.",
    belowAverage: 'Focus on accuracy. Reduce those errors.',
  },
  averageInfo: 'The average typing accuracy for humans is around 92%.',
  fillColor: 'hsl(var(--success))',
};

// Time formatting utilities
export function formatTimeSpent(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function formatDateRange(firstDate: string): string {
  const first = new Date(firstDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - first.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'since yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  }
}

// Re-export utilities for convenience
export * from './layout-utils';
export * from './metrics-utils';
