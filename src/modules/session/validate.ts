import { z } from 'zod';
import type { EnhancedStoredData } from './types';

const finiteNonNegative = z.number().finite().nonnegative();

const letterMetricsSchema = z.record(
  z.string(),
  z.object({ correct: z.number(), total: z.number() }),
);

const errorPairSchema = z.object({
  expected: z.string(),
  typed: z.string(),
  count: finiteNonNegative,
});

const configSchema = z.object({
  mode: z.enum(['time', 'words']),
  timeSeconds: finiteNonNegative,
  wordCount: finiteNonNegative,
  language: z.string(),
  punctuationEnabled: z.boolean(),
  numbersEnabled: z.boolean(),
});

const countersSchema = z.object({
  correctChars: finiteNonNegative,
  typedChars: finiteNonNegative,
  backspaces: finiteNonNegative,
  correctWords: finiteNonNegative,
  completedWords: finiteNonNegative,
});

const paceBucketSchema = z.object({
  second: finiteNonNegative,
  typedChars: finiteNonNegative,
  correctChars: finiteNonNegative,
  backspaces: finiteNonNegative,
  rawWpm: finiteNonNegative,
  adjustedWpm: finiteNonNegative,
});

const pauseTelemetrySchema = z.object({
  longestPauseMs: finiteNonNegative,
  pausesOver500ms: finiteNonNegative,
  earlyAverageWpm: finiteNonNegative,
  middleAverageWpm: finiteNonNegative,
  finalAverageWpm: finiteNonNegative,
});

const correctionClusterSchema = z.object({
  startSecond: finiteNonNegative,
  endSecond: finiteNonNegative,
  count: finiteNonNegative,
});

const keyTelemetrySchema = z.object({
  attempts: finiteNonNegative,
  correct: finiteNonNegative,
  errorPairs: z.array(errorPairSchema),
});

const insightsSchema = z.object({
  correctionCount: finiteNonNegative,
  errorPairs: z.array(errorPairSchema),
  pace: z.array(paceBucketSchema),
  keys: z.record(z.string(), keyTelemetrySchema),
  pauses: pauseTelemetrySchema,
  correctionClusters: z.array(correctionClusterSchema),
});

const sessionSchema = z.object({
  wpm: z.number(),
  rawWpm: z.number(),
  accuracy: z.number(),
  testDate: z.string(),
  testDuration: z.number(),
  wordsTyped: z.number(),
  correctWords: z.number(),
  letterAccuracy: letterMetricsSchema,
  mode: z.enum(['time', 'words']),
  consistency: finiteNonNegative,
  burst: finiteNonNegative,
  wpmSeries: z.array(
    z.object({ second: finiteNonNegative, wpm: finiteNonNegative, rawWpm: finiteNonNegative }),
  ),
  config: configSchema,
  counters: countersSchema,
  insights: insightsSchema,
});

const exactCountersSchema = z.object({
  totalCorrectChars: finiteNonNegative,
  totalTypedChars: finiteNonNegative,
  totalBackspaces: finiteNonNegative,
  exactDurationSeconds: finiteNonNegative,
  exactCorrectWords: finiteNonNegative,
  exactCompletedWords: finiteNonNegative,
  exactTestCount: finiteNonNegative,
});

const cumulativeStatsSchema = z.object({
  totalTests: z.number(),
  totalWordsTyped: z.number(),
  totalTimeSpent: z.number(),
  totalCorrectWords: z.number(),
  weightedWPM: z.number(),
  weightedRawWPM: z.number(),
  weightedAccuracy: z.number(),
  weightedConsistency: z.number(),
  weightedBurst: z.number(),
  letterStats: letterMetricsSchema,
  firstTestDate: z.string(),
  lastTestDate: z.string(),
  exact: exactCountersSchema,
});

const storedDataSchema = z.object({
  lastSession: sessionSchema,
  cumulative: cumulativeStatsSchema,
  recentSessions: z.array(sessionSchema).max(30),
});

export function validateStoredData(value: unknown): value is EnhancedStoredData {
  return storedDataSchema.safeParse(value).success;
}
