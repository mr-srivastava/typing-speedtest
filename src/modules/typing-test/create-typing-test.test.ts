import { describe, expect, it } from 'vitest';
import { createTypingTest } from './create-typing-test';

const SAMPLE = 'hello world';

function createTest(duration = 60) {
  return createTypingTest({
    duration,
    getText: () => SAMPLE,
  });
}

describe('createTypingTest', () => {
  it('starts idle and becomes active on first input', () => {
    const test = createTest();
    expect(test.getState().phase).toBe('idle');

    test.dispatch({ type: 'input', value: 'h' });

    const state = test.getState();
    expect(state.phase).toBe('active');
    expect(state.input).toBe('h');
    expect(state.letterAccuracy.h).toEqual({ correct: 1, total: 1 });
  });

  it('finishes with a snapshot when input is complete', () => {
    const test = createTest();
    test.dispatch({ type: 'input', value: SAMPLE });

    const state = test.getState();
    expect(state.phase).toBe('finished');
    expect(state.snapshot).toEqual({
      correctWordCount: 2,
      totalWordCount: 2,
      timer: 60,
      letterAccuracy: state.letterAccuracy,
    });
  });

  it('resets all state on restart', () => {
    const test = createTest();
    test.dispatch({ type: 'input', value: 'hel' });
    test.dispatch({ type: 'tick' });
    test.dispatch({ type: 'restart' });

    const state = test.getState();
    expect(state.phase).toBe('idle');
    expect(state.input).toBe('');
    expect(state.timerRemaining).toBe(60);
    expect(state.correctWordCount).toBe(0);
    expect(state.totalWordCount).toBe(0);
    expect(state.letterAccuracy).toEqual({});
    expect(state.snapshot).toBeNull();
  });

  it('finishes with timer=0 when ticks reach zero', () => {
    const test = createTest(2);
    test.dispatch({ type: 'input', value: 'h' });
    expect(test.getState().phase).toBe('active');

    test.dispatch({ type: 'tick' });
    expect(test.getState().timerRemaining).toBe(1);
    expect(test.getState().phase).toBe('active');

    test.dispatch({ type: 'tick' });
    const state = test.getState();
    expect(state.phase).toBe('finished');
    expect(state.timerRemaining).toBe(0);
    expect(state.snapshot?.timer).toBe(0);
    expect(state.snapshot?.correctWordCount).toBe(0);
  });

  it('ignores input and ticks after finished', () => {
    const test = createTest();
    test.dispatch({ type: 'input', value: SAMPLE });
    const finished = test.getState();

    test.dispatch({ type: 'input', value: SAMPLE + 'x' });
    test.dispatch({ type: 'tick' });

    expect(test.getState().input).toBe(finished.input);
    expect(test.getState().phase).toBe('finished');
  });
});
