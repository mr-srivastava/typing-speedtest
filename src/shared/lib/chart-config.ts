import { themeColors } from '@/shared/lib/theme';

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
    excellent: 'Fast and controlled.',
    average: 'A solid pace to build on.',
    belowAverage: 'Keep a steady rhythm.',
  },
  averageInfo: 'A typical typing pace is around 40 WPM.',
  fillColor: themeColors.primary,
};

export const accuracyChartConfig: RadialMetricConfig = {
  maxValue: 100,
  showPercentage: true,
  feedbackThresholds: { excellent: 95, average: 90 },
  feedbackMessages: {
    excellent: 'Clean work.',
    average: 'Accuracy is holding steady.',
    belowAverage: 'Slow down for fewer corrections.',
  },
  averageInfo: 'A useful target is 92% accuracy or higher.',
  fillColor: themeColors.success,
};

export interface WpmHistorySeriesConfig {
  label: string;
  color: string;
}

export const wpmHistoryChartConfig: Record<'wpm' | 'rawWpm', WpmHistorySeriesConfig> = {
  wpm: { label: 'Correct WPM', color: themeColors.primary },
  rawWpm: { label: 'Raw WPM', color: themeColors.chart2 },
};
