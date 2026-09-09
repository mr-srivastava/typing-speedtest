import { calculateWpm } from '@/modules/metrics';
import type { TypingEventLog, TypingLogEvent } from './event-log';

export interface WpmSeriesPoint {
  second: number;
  wpm: number;
  rawWpm: number;
}

type CharEvent = Extract<TypingLogEvent, { type: 'char' }>;

function isCharEvent(event: TypingLogEvent): event is CharEvent {
  return event.type === 'char';
}

/**
 * Per-second instantaneous WPM/raw-WPM, derived by replaying the event log and
 * bucketing char/backspace deltas into 1-second windows since the first event.
 * A backspace pops the correctness of whichever char is currently last, so a
 * mistake corrected within the same test still nets out — same semantics as
 * `typing-engine.ts`'s char-based accuracy, just kept incrementally instead of
 * recomputed from scratch on every keystroke.
 */
export function deriveWpmSeries(log: TypingEventLog): WpmSeriesPoint[] {
  if (log.length === 0) {
    return [];
  }

  const totalSeconds = Math.max(1, Math.ceil(log[log.length - 1].t / 1000));
  const correctStack: boolean[] = [];

  let typedChars = 0;
  let correctChars = 0;
  let prevTyped = 0;
  let prevCorrect = 0;
  let eventIndex = 0;

  const series: WpmSeriesPoint[] = [];

  for (let second = 1; second <= totalSeconds; second++) {
    const boundaryMs = second * 1000;

    while (eventIndex < log.length && log[eventIndex].t <= boundaryMs) {
      const event = log[eventIndex];
      if (event.type === 'char') {
        correctStack.push(event.correct);
        typedChars++;
        if (event.correct) correctChars++;
      } else {
        const wasCorrect = correctStack.pop();
        if (wasCorrect !== undefined) {
          typedChars = Math.max(0, typedChars - 1);
          if (wasCorrect) correctChars = Math.max(0, correctChars - 1);
        }
      }
      eventIndex++;
    }

    const deltaTyped = Math.max(0, typedChars - prevTyped);
    const deltaCorrect = Math.max(0, correctChars - prevCorrect);
    prevTyped = typedChars;
    prevCorrect = correctChars;

    series.push({
      second,
      wpm: calculateWpm(deltaCorrect, 1),
      rawWpm: calculateWpm(deltaTyped, 1),
    });
  }

  return series;
}

/**
 * Monkeytype-style consistency: 100 * (1 - coefficient of variation) of the
 * per-second raw WPM, clamped to [0, 100]. Higher = more even pacing.
 */
export function deriveConsistency(series: WpmSeriesPoint[]): number {
  if (series.length === 0) {
    return 0;
  }

  const values = series.map((point) => point.rawWpm);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  if (mean <= 0) {
    return 0;
  }

  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const consistency = 100 * (1 - stdDev / mean);

  return Math.max(0, Math.min(100, Math.round(consistency)));
}

/**
 * Highest instantaneous WPM sustained over a short rolling window (default 1s),
 * measured directly from raw keystrokes (not the per-second series).
 */
export function deriveBurst(log: TypingEventLog, windowMs = 1000): number {
  const charEvents = log.filter(isCharEvent);
  if (charEvents.length === 0) {
    return 0;
  }

  let maxWpm = 0;
  let windowStart = 0;

  for (let i = 0; i < charEvents.length; i++) {
    while (charEvents[i].t - charEvents[windowStart].t > windowMs) {
      windowStart++;
    }
    if (windowStart === i) {
      continue; // not enough events yet to measure a rate
    }

    const count = i - windowStart + 1;
    const durationSeconds = (charEvents[i].t - charEvents[windowStart].t) / 1000;
    const wpm = calculateWpm(count, durationSeconds);
    if (wpm > maxWpm) {
      maxWpm = wpm;
    }
  }

  return maxWpm;
}
