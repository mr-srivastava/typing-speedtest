export const wpmChartConfig = {
  value: 200,
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
  value: 100,
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
