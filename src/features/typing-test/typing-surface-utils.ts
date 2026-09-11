export interface TextSpan {
  text: string;
  startIndex: number;
  isWhitespace: boolean;
}

/** Split reference text into word and whitespace spans with stable indices. */
export function parseReferenceSpans(referenceText: string): TextSpan[] {
  const spans: TextSpan[] = [];
  const regex = /\S+|\s+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(referenceText)) !== null) {
    spans.push({
      text: match[0],
      startIndex: match.index,
      isWhitespace: /^\s+$/.test(match[0]),
    });
  }

  return spans;
}

export function getCurrentWordSpanIndex(spans: TextSpan[], cursorIndex: number): number {
  let lastWordIndex = 0;

  for (let i = 0; i < spans.length; i++) {
    if (spans[i].isWhitespace) {
      continue;
    }

    lastWordIndex = i;
    const wordEnd = spans[i].startIndex + spans[i].text.length;

    if (cursorIndex <= wordEnd) {
      return i;
    }
  }

  return lastWordIndex;
}

export type CharStatus = 'pending' | 'correct' | 'incorrect' | 'cursor';

export function getCharStatus(referenceText: string, input: string, index: number): CharStatus {
  if (index < input.length) {
    return input[index] === referenceText[index] ? 'correct' : 'incorrect';
  }

  if (index === input.length) {
    return 'cursor';
  }

  return 'pending';
}

export const typingSurfaceTypography =
  'text-xl md:text-2xl font-mono leading-loose tracking-wide [word-spacing:0.3em]';

export const typingSurfacePadding = 'px-1 py-4 md:py-6';

/** Number of reference-text lines kept visible at once — the rest scrolls off. */
export const TYPING_SURFACE_VISIBLE_LINES = 3;
