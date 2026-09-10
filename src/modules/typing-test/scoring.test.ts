import { describe, expect, it } from 'vitest';
import { calculateCurrentAccuracy, calculateWpm, resolveTestElapsedSeconds } from './scoring';

describe('typing-test scoring', () => {
  it('preserves the five-character WPM convention', () => {
    expect(calculateWpm(50, 50)).toBe(12);
    expect(calculateWpm(50, 0)).toBe(0);
  });

  it('uses a one-second floor for active time and word tests', () => {
    expect(resolveTestElapsedSeconds({ mode: 'time', timerDuration: 60, timerRemaining: 60 })).toBe(
      1,
    );
    expect(resolveTestElapsedSeconds({ mode: 'time', timerDuration: 60, timerRemaining: 10 })).toBe(
      50,
    );
    expect(resolveTestElapsedSeconds({ mode: 'words', elapsedSeconds: 0 })).toBe(1);
  });

  it('returns zero accuracy when no words have been attempted', () => {
    expect(calculateCurrentAccuracy(0, 0)).toBe(0);
    expect(calculateCurrentAccuracy(3, 4)).toBe(75);
  });
});
