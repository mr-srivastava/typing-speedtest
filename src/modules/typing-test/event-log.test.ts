import { describe, expect, it } from 'vitest';
import { diffInputToEvents } from './event-log';

const REF = 'hello world';

describe('diffInputToEvents', () => {
  it('returns no events when input is unchanged', () => {
    expect(diffInputToEvents('hel', 'hel', REF, 100)).toEqual([]);
  });

  it('emits one correct char event on a single-char append', () => {
    const events = diffInputToEvents('hel', 'hell', REF, 100);
    expect(events).toEqual([{ type: 'char', t: 100, char: 'l', expected: 'l', correct: true }]);
  });

  it('emits one incorrect char event when the typed char is wrong', () => {
    const events = diffInputToEvents('hel', 'helx', REF, 100);
    expect(events).toEqual([{ type: 'char', t: 100, char: 'x', expected: 'l', correct: false }]);
  });

  it('emits one backspace event on a single-char removal', () => {
    const events = diffInputToEvents('hell', 'hel', REF, 200);
    expect(events).toEqual([{ type: 'backspace', t: 200 }]);
  });

  it('emits one event per char for a multi-char paste', () => {
    const events = diffInputToEvents('', 'hel', REF, 50);
    expect(events).toEqual([
      { type: 'char', t: 50, char: 'h', expected: 'h', correct: true },
      { type: 'char', t: 50, char: 'e', expected: 'e', correct: true },
      { type: 'char', t: 50, char: 'l', expected: 'l', correct: true },
    ]);
  });

  it('emits one backspace per char for a multi-char deletion', () => {
    const events = diffInputToEvents('hello', 'he', REF, 300);
    expect(events).toEqual([
      { type: 'backspace', t: 300 },
      { type: 'backspace', t: 300 },
      { type: 'backspace', t: 300 },
    ]);
  });

  it('treats a full replacement as removals then additions past the common prefix', () => {
    const events = diffInputToEvents('hello', 'help', REF, 400);
    // common prefix "hel"; "lo" removed, "p" added
    expect(events).toEqual([
      { type: 'backspace', t: 400 },
      { type: 'backspace', t: 400 },
      { type: 'char', t: 400, char: 'p', expected: 'l', correct: false },
    ]);
  });

  it('marks a char past the end of the reference text as incorrect', () => {
    const events = diffInputToEvents('hello world', 'hello world!', REF, 500);
    expect(events).toEqual([{ type: 'char', t: 500, char: '!', expected: '', correct: false }]);
  });
});
