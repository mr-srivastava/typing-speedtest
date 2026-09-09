import { describe, expect, it } from 'vitest';
import { DEFAULT_TEST_CONFIG, type TestConfig } from './config';
import { createTypingTest, type TypingTest } from './create-typing-test';

const SAMPLE = 'hello world';

function createTest(overrides: Partial<TestConfig> = {}): Promise<TypingTest> {
  return new Promise((resolve) => {
    const test = createTypingTest({
      testConfig: { ...DEFAULT_TEST_CONFIG, ...overrides },
      getReferenceText: async () => SAMPLE,
    });
    test.onReady(() => resolve(test));
  });
}

describe('createTypingTest', () => {
  it('loads then starts idle, and becomes active on first input', async () => {
    const test = await createTest();
    expect(test.getState().phase).toBe('idle');
    expect(test.getState().referenceText).toBe(SAMPLE);

    test.dispatch({ type: 'input', value: 'h' });

    const state = test.getState();
    expect(state.phase).toBe('active');
    expect(state.input).toBe('h');
    expect(state.letterAccuracy.h).toEqual({ correct: 1, total: 1 });
  });

  it('finishes with a snapshot when input is complete', async () => {
    const test = await createTest();
    test.dispatch({ type: 'input', value: SAMPLE });

    const state = test.getState();
    expect(state.phase).toBe('finished');
    expect(state.snapshot).toMatchObject({
      correctWordCount: 2,
      totalWordCount: 2,
      correctChars: SAMPLE.length,
      typedChars: SAMPLE.length,
      timerRemaining: 60,
      timerDuration: 60,
      letterAccuracy: state.letterAccuracy,
      mode: 'time',
    });
    expect(state.snapshot?.eventLog.length).toBe(SAMPLE.length);
    expect(state.snapshot?.wpmSeries.length).toBeGreaterThan(0);
    expect(typeof state.snapshot?.consistency).toBe('number');
    expect(typeof state.snapshot?.burst).toBe('number');
  });

  it('resets all state on restart', async () => {
    const test = await createTest();
    test.dispatch({ type: 'input', value: 'hel' });
    test.dispatch({ type: 'tick' });
    await new Promise<void>((resolve) => {
      test.onReady(resolve);
      test.dispatch({ type: 'restart' });
    });

    const state = test.getState();
    expect(state.phase).toBe('idle');
    expect(state.input).toBe('');
    expect(state.mode).toBe('time');
    if (state.mode === 'time') {
      expect(state.timerRemaining).toBe(60);
    }
    expect(state.correctWordCount).toBe(0);
    expect(state.totalWordCount).toBe(0);
    expect(state.correctChars).toBe(0);
    expect(state.typedChars).toBe(0);
    expect(state.eventLog).toEqual([]);
    expect(state.letterAccuracy).toEqual({});
    expect(state.snapshot).toBeNull();
  });

  it('finishes with timerRemaining=0 when ticks reach zero', async () => {
    const test = await createTest({ timeSeconds: 2 });
    test.dispatch({ type: 'input', value: 'h' });
    expect(test.getState().phase).toBe('active');

    test.dispatch({ type: 'tick' });
    const midState = test.getState();
    expect(midState.mode).toBe('time');
    if (midState.mode === 'time') {
      expect(midState.timerRemaining).toBe(1);
    }
    expect(midState.phase).toBe('active');

    test.dispatch({ type: 'tick' });
    const state = test.getState();
    expect(state.phase).toBe('finished');
    expect(state.mode).toBe('time');
    if (state.mode === 'time') {
      expect(state.timerRemaining).toBe(0);
    }
    expect(state.snapshot?.mode).toBe('time');
    if (state.snapshot?.mode === 'time') {
      expect(state.snapshot.timerRemaining).toBe(0);
    }
    expect(state.snapshot?.correctWordCount).toBe(0);
  });

  it('ignores input and ticks after finished', async () => {
    const test = await createTest();
    test.dispatch({ type: 'input', value: SAMPLE });
    const finished = test.getState();

    test.dispatch({ type: 'input', value: SAMPLE + 'x' });
    test.dispatch({ type: 'tick' });

    expect(test.getState().input).toBe(finished.input);
    expect(test.getState().phase).toBe('finished');
  });

  it('counts elapsed seconds upward in word mode instead of a countdown', async () => {
    const test = await createTest({ mode: 'words', wordCount: 2 });
    const initial = test.getState();
    expect(initial.mode).toBe('words');
    if (initial.mode === 'words') {
      expect(initial.elapsedSeconds).toBe(0);
    }

    test.dispatch({ type: 'input', value: 'h' });
    test.dispatch({ type: 'tick' });
    test.dispatch({ type: 'tick' });

    const state = test.getState();
    expect(state.phase).toBe('active');
    expect(state.mode).toBe('words');
    if (state.mode === 'words') {
      expect(state.elapsedSeconds).toBe(2);
    }
  });

  it('finishes word mode on matching input length, not on tick', async () => {
    const test = await createTest({ mode: 'words', wordCount: 2 });
    test.dispatch({ type: 'input', value: SAMPLE });

    const state = test.getState();
    expect(state.phase).toBe('finished');
    expect(state.snapshot?.mode).toBe('words');
  });

  it('reconfigure swaps the test config and regenerates the reference text', async () => {
    const test = await createTest();
    await new Promise<void>((resolve) => {
      test.onReady(resolve);
      test.dispatch({ type: 'reconfigure', config: { ...DEFAULT_TEST_CONFIG, mode: 'words' } });
    });

    const state = test.getState();
    expect(state.phase).toBe('idle');
    expect(state.mode).toBe('words');
    expect(state.config.mode).toBe('words');
  });

  it('enters an error state when reference-text loading fails and can restart', async () => {
    let attempt = 0;
    const test = createTypingTest({
      testConfig: DEFAULT_TEST_CONFIG,
      getReferenceText: async () => {
        attempt++;
        if (attempt === 1) {
          throw new Error('word list unavailable');
        }
        return SAMPLE;
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(test.getState().phase).toBe('error');
    expect(test.getState().loadError).toContain('word list unavailable');

    await new Promise<void>((resolve) => {
      test.onReady(resolve);
      test.dispatch({ type: 'restart' });
    });

    expect(test.getState().phase).toBe('idle');
    expect(test.getState().referenceText).toBe(SAMPLE);
  });

  it('unsubscribes an onReady listener when the returned function is called', async () => {
    const test = createTypingTest({
      testConfig: DEFAULT_TEST_CONFIG,
      getReferenceText: async () => SAMPLE,
    });
    let calls = 0;
    const unsubscribe = test.onReady(() => calls++);
    unsubscribe();

    await new Promise<void>((resolve) => {
      test.onReady(resolve); // second listener still fires once loading resolves
    });

    expect(calls).toBe(0);
  });
});
