import { describe, expect, it } from 'vitest';
import { deriveBurst, deriveConsistency, deriveWpmSeries } from './replay';
import type { TypingEventLog, TypingLogEvent } from './event-log';

function charAt(t: number, correct = true): TypingLogEvent {
  return { type: 'char', t, char: 'a', expected: correct ? 'a' : 'b', correct };
}

function backspaceAt(t: number): TypingLogEvent {
  return { type: 'backspace', t };
}

describe('deriveWpmSeries', () => {
  it('returns an empty series for an empty log', () => {
    expect(deriveWpmSeries([])).toEqual([]);
  });

  it('buckets chars typed within the same second into one point', () => {
    const log: TypingEventLog = [charAt(100), charAt(300), charAt(500), charAt(700), charAt(900)];
    const series = deriveWpmSeries(log);
    expect(series).toHaveLength(1);
    // 5 correct chars / 5 = 1 "word", over 1 second -> 60 wpm
    expect(series[0]).toEqual({ second: 1, wpm: 60, rawWpm: 60 });
  });

  it('nets a backspace against the char it removes', () => {
    const log: TypingEventLog = [charAt(100), charAt(200, false), backspaceAt(300), charAt(400)];
    const series = deriveWpmSeries(log);
    expect(series[0].rawWpm).toBeGreaterThan(0);
    // both chars left standing are correct, so correct wpm should equal raw wpm
    expect(series[0].wpm).toBe(series[0].rawWpm);
  });

  it('produces one point per elapsed second, including idle seconds', () => {
    const log: TypingEventLog = [charAt(100), charAt(2500)];
    const series = deriveWpmSeries(log);
    expect(series.map((point) => point.second)).toEqual([1, 2, 3]);
  });
});

describe('deriveConsistency', () => {
  it('returns 0 for an empty series', () => {
    expect(deriveConsistency([])).toBe(0);
  });

  it('returns 100 for a perfectly even series', () => {
    const series = [
      { second: 1, wpm: 60, rawWpm: 60 },
      { second: 2, wpm: 60, rawWpm: 60 },
      { second: 3, wpm: 60, rawWpm: 60 },
    ];
    expect(deriveConsistency(series)).toBe(100);
  });

  it('drops below 100 for an uneven series', () => {
    const series = [
      { second: 1, wpm: 120, rawWpm: 120 },
      { second: 2, wpm: 0, rawWpm: 0 },
      { second: 3, wpm: 120, rawWpm: 120 },
    ];
    expect(deriveConsistency(series)).toBeLessThan(100);
  });
});

describe('deriveBurst', () => {
  it('returns 0 for an empty log', () => {
    expect(deriveBurst([])).toBe(0);
  });

  it('returns 0 when there is only one char event (no measurable rate)', () => {
    expect(deriveBurst([charAt(100)])).toBe(0);
  });

  it('reflects a fast burst higher than the sustained average', () => {
    // 5 chars in the first 200ms, then a long gap, then 2 slow chars
    const log: TypingEventLog = [
      charAt(0),
      charAt(50),
      charAt(100),
      charAt(150),
      charAt(200),
      charAt(5000),
      charAt(6000),
    ];
    const burst = deriveBurst(log);
    const series = deriveWpmSeries(log);
    const overallAvg = series.reduce((sum, point) => sum + point.rawWpm, 0) / series.length;
    expect(burst).toBeGreaterThan(overallAvg);
  });
});
