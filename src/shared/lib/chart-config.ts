import { themeColors } from '@/shared/lib/theme';
import type { ChartConfig } from '@/shared/ui/chart';

export interface RadialMetricFeedbackMessages {
  excellent: string;
  average: string;
  belowAverage: string;
}

export interface RadialMetricFeedbackThresholds {
  excellent: number;
  average: number;
}

export interface RadialMetricConfig {
  maxValue: number;
  showPercentage: boolean;
  feedbackThresholds: RadialMetricFeedbackThresholds;
  feedbackMessages: RadialMetricFeedbackMessages;
  averageInfo: string;
  fillColor: string;
}

export const wpmChartConfig: RadialMetricConfig = {
  maxValue: 200,
  showPercentage: false,
  feedbackThresholds: { excellent: 80, average: 40 },
  feedbackMessages: {
    excellent: "Excellent! You're typing like a pro.",
    average: 'Good speed! Keep practicing to improve.',
    belowAverage: 'Focus on building up your speed.',
  },
  averageInfo: 'The average typing speed is around 40 WPM.',
  fillColor: themeColors.success,
};

export const accuracyChartConfig: RadialMetricConfig = {
  maxValue: 100,
  showPercentage: true,
  feedbackThresholds: { excellent: 95, average: 90 },
  feedbackMessages: {
    excellent: 'Excellent! Your accuracy is top-notch.',
    average: "Keep practicing! You're close to average.",
    belowAverage: 'Focus on accuracy. Reduce those errors.',
  },
  averageInfo: 'The average typing accuracy for humans is around 92%.',
  fillColor: themeColors.success,
};

export const wpmHistoryChartConfig: ChartConfig = {
  wpm: { label: 'Correct WPM', color: themeColors.success },
  rawWpm: { label: 'Raw WPM', color: themeColors.chart2 },
};
