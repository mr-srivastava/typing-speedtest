import type { TestSession } from '@/modules/session/types';

export interface CoachingInsight {
  title: string;
  detail: string;
}

function matchesConfig(a: TestSession, b: TestSession): boolean {
  if (a.config.mode !== b.config.mode) return false;
  if (a.config.mode === 'time' && a.config.timeSeconds !== b.config.timeSeconds) return false;
  if (a.config.mode === 'words' && a.config.wordCount !== b.config.wordCount) return false;
  return (
    a.config.language === b.config.language &&
    a.config.punctuationEnabled === b.config.punctuationEnabled &&
    a.config.numbersEnabled === b.config.numbersEnabled
  );
}

export function deriveBaseline(current: TestSession, recent: TestSession[]): number | undefined {
  const comparable = recent.filter(
    (test) => test.testDate !== current.testDate && matchesConfig(test, current),
  );
  if (comparable.length < 2) return undefined;
  return Math.round(comparable.reduce((sum, test) => sum + test.wpm, 0) / comparable.length);
}

export function deriveCoachingInsight(test: TestSession): CoachingInsight {
  const correctionCost = Math.max(0, test.rawWpm - test.wpm);
  if (correctionCost >= 5) {
    return {
      title: 'Reduce correction cost',
      detail: `${correctionCost} WPM was lost to corrections. Slow down slightly to keep more of your raw speed.`,
    };
  }

  const pace = test.insights.pauses;
  if (pace.finalAverageWpm + 8 < pace.earlyAverageWpm) {
    return {
      title: 'Finish with the same rhythm',
      detail: `Your pace fell from ${pace.earlyAverageWpm} to ${pace.finalAverageWpm} raw WPM near the end. Aim for a calmer start.`,
    };
  }

  const weakKey = Object.entries(test.letterAccuracy)
    .filter(([, metrics]) => metrics.total >= 8)
    .map(([key, metrics]) => ({
      key,
      ...metrics,
      accuracy: Math.round((metrics.correct / metrics.total) * 100),
    }))
    .filter((metrics) => metrics.accuracy < 92)
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)[0];

  if (weakKey) {
    return {
      title: `Focus on ${weakKey.key.toUpperCase()}`,
      detail: `${weakKey.accuracy}% accuracy across ${weakKey.total} presses. Slow down slightly when this key appears.`,
    };
  }

  const corrections = test.insights.correctionCount;
  if (corrections >= 4) {
    return {
      title: 'Reduce correction cost',
      detail: `${corrections} backspaces and a ${Math.max(0, test.rawWpm - test.wpm)} WPM gap suggest a steadier pace will improve your score.`,
    };
  }

  return {
    title: 'Keep this pace',
    detail:
      'Your speed and accuracy are balanced. Repeat this format to build a reliable baseline.',
  };
}
