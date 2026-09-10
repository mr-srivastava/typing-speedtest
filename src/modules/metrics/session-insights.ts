import type { TypingEventLog, WpmSeriesPoint } from '@/modules/typing-test';
import type { KeyTelemetry, PaceBucket, TestInsights } from '@/modules/session/types';

function createPaceBuckets(log: TypingEventLog, series: WpmSeriesPoint[]): PaceBucket[] {
  const buckets = series.map((point) => ({
    second: point.second,
    typedChars: 0,
    correctChars: 0,
    backspaces: 0,
    rawWpm: point.rawWpm,
    adjustedWpm: point.wpm,
  }));
  for (const event of log) {
    const bucket = buckets[Math.max(0, Math.ceil(event.t / 1000) - 1)];
    if (!bucket) continue;
    if (event.type === 'backspace') bucket.backspaces++;
    else {
      bucket.typedChars++;
      if (event.correct) bucket.correctChars++;
    }
  }
  return buckets;
}

function average(values: number[]): number {
  return values.length === 0
    ? 0
    : Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

/** Keep event-log value without persisting every keystroke. */
export function deriveTestInsights(
  eventLog: TypingEventLog,
  series: WpmSeriesPoint[],
): TestInsights {
  const pairs = new Map<string, { expected: string; typed: string; count: number }>();
  const pairsByExpected = new Map<
    string,
    Map<string, { expected: string; typed: string; count: number }>
  >();
  const keys: Record<string, KeyTelemetry> = {};
  let correctionCount = 0;

  for (const event of eventLog) {
    if (event.type === 'backspace') {
      correctionCount++;
      continue;
    }
    const expected = event.expected.toLowerCase();
    if (/^[a-z]$/.test(expected)) {
      const key = keys[expected] ?? { attempts: 0, correct: 0, errorPairs: [] };
      key.attempts++;
      if (event.correct) key.correct++;
      keys[expected] = key;
    }
    if (event.correct || event.expected === ' ' || event.char === ' ') continue;
    const key = `${event.expected}\u0000${event.char}`;
    const current = pairs.get(key);
    const pair = current
      ? { ...current, count: current.count + 1 }
      : { expected: event.expected, typed: event.char, count: 1 };
    pairs.set(key, pair);
    const expectedPairs = pairsByExpected.get(expected) ?? new Map();
    expectedPairs.set(event.char, pair);
    pairsByExpected.set(expected, expectedPairs);
  }

  const errorPairs = [...pairs.values()].sort((a, b) => b.count - a.count).slice(0, 12);
  for (const [key, telemetry] of Object.entries(keys)) {
    telemetry.errorPairs = [...(pairsByExpected.get(key)?.values() ?? [])]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }
  const pace = createPaceBuckets(eventLog, series);
  const correctionClusters = pace.reduce<NonNullable<TestInsights['correctionClusters']>>(
    (clusters, bucket) => {
      if (bucket.backspaces === 0) return clusters;
      const previous = clusters.at(-1);
      if (previous && previous.endSecond === bucket.second - 1) {
        previous.endSecond = bucket.second;
        previous.count += bucket.backspaces;
      } else {
        clusters.push({
          startSecond: bucket.second,
          endSecond: bucket.second,
          count: bucket.backspaces,
        });
      }
      return clusters;
    },
    [],
  );
  const third = Math.ceil(pace.length / 3);
  const pauses = eventLog.slice(1).map((event, index) => event.t - eventLog[index].t);

  return {
    correctionCount,
    errorPairs,
    pace,
    keys,
    pauses: {
      longestPauseMs: Math.max(0, ...pauses),
      pausesOver500ms: pauses.filter((pause) => pause > 500).length,
      earlyAverageWpm: average(pace.slice(0, third).map((point) => point.rawWpm)),
      middleAverageWpm: average(pace.slice(third, third * 2).map((point) => point.rawWpm)),
      finalAverageWpm: average(pace.slice(third * 2).map((point) => point.rawWpm)),
    },
    correctionClusters,
  };
}
