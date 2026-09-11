'use client';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  getCurrentWordSpanIndex,
  parseReferenceSpans,
  TYPING_SURFACE_VISIBLE_LINES,
  type TextSpan,
  typingSurfacePadding,
  typingSurfaceTypography,
} from '@/features/typing-test/typing-surface-utils';
import { getAccuracyColorClass } from '@/shared/layout/theme-display-utils';
import { cn } from '@/shared/lib/cn';
import { motion as motionTokens, size } from '@/shared/lib/tokens';

interface TypingSurfaceProps {
  referenceText: string;
  input: string;
  onInputChange: (value: string) => void;
  readOnly: boolean;
  focusKey?: string;
  className?: string;
}

interface ReferenceSpanProps {
  span: TextSpan;
  index: number;
  typedText: string;
  isCurrentWord: boolean;
  setSpanRef: (index: number, element: HTMLSpanElement | null) => void;
}

/**
 * Only the span receiving the current keystroke changes. Completed and future
 * spans keep stable primitive props, letting React skip their character trees.
 */
const ReferenceSpan = React.memo(function ReferenceSpan({
  span,
  index,
  typedText,
  isCurrentWord,
  setSpanRef,
}: ReferenceSpanProps) {
  return (
    <span
      ref={(element) => setSpanRef(index, element)}
      className={cn(isCurrentWord && 'rounded bg-primary/10 px-0.5')}
    >
      {span.text.split('').map((char, charIndex) => {
        const typedChar = typedText[charIndex];
        const isTyped = typedChar !== undefined;
        const className = isTyped
          ? cn(getAccuracyColorClass(typedChar === char), 'opacity-90')
          : isCurrentWord && charIndex === typedText.length
            ? 'bg-primary/30 text-foreground'
            : 'text-muted-foreground';

        return (
          <span
            key={span.startIndex + charIndex}
            className={cn(motionTokens.transitionColors, className)}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
});

interface LineScrollState {
  offsetPx: number;
  lineHeightPx: number;
}

const initialLineScrollState: LineScrollState = { offsetPx: 0, lineHeightPx: 0 };

const TypingSurface: React.FC<TypingSurfaceProps> = ({
  referenceText,
  input,
  onInputChange,
  readOnly,
  focusKey,
  className = '',
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [lineScroll, setLineScroll] = useState<LineScrollState>(initialLineScrollState);

  const spans = useMemo(() => parseReferenceSpans(referenceText), [referenceText]);

  const cursorIndex = input.length;
  const currentSpanIndex = getCurrentWordSpanIndex(spans, cursorIndex);
  const setSpanRef = useCallback((index: number, element: HTMLSpanElement | null) => {
    spanRefs.current[index] = element;
  }, []);

  useEffect(() => {
    if (!readOnly) {
      inputRef.current?.focus();
    }
  }, [readOnly, focusKey]);

  /**
   * Keeps the reference text clipped to a fixed number of lines: measures which
   * row the active word sits on from the rendered spans, then translates the
   * whole block up by whole line-heights so the active line becomes the top
   * visible row — completed lines scroll out, new ones scroll in underneath.
   *
   * The transformed block itself carries no padding (that lives on a
   * non-transformed wrapper), so the first span's offsetTop is just line-box
   * leading — line math stays exact and no sliver of the previous line bleeds
   * into the window.
   */
  const recalcLineScroll = useCallback(() => {
    const firstSpan = spanRefs.current[0];
    const currentSpan = spanRefs.current[currentSpanIndex];
    if (!firstSpan || !currentSpan) return;

    const firstRowTop = firstSpan.offsetTop;
    const secondRowSpan = spanRefs.current.find((el) => !!el && el.offsetTop > firstRowTop);
    const lineHeightPx = secondRowSpan
      ? secondRowSpan.offsetTop - firstRowTop
      : currentSpan.offsetHeight;

    if (lineHeightPx <= 0) return;

    const rowIndex = Math.round((currentSpan.offsetTop - firstRowTop) / lineHeightPx);
    const offsetPx = Math.max(0, rowIndex) * lineHeightPx;

    setLineScroll((previous) =>
      previous.offsetPx === offsetPx && previous.lineHeightPx === lineHeightPx
        ? previous
        : { offsetPx, lineHeightPx },
    );
  }, [currentSpanIndex]);

  useLayoutEffect(() => {
    recalcLineScroll();
  }, [recalcLineScroll, focusKey]);

  useEffect(() => {
    window.addEventListener('resize', recalcLineScroll);
    return () => window.removeEventListener('resize', recalcLineScroll);
  }, [recalcLineScroll]);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const windowHeightPx =
    lineScroll.lineHeightPx > 0
      ? lineScroll.lineHeightPx * TYPING_SURFACE_VISIBLE_LINES
      : undefined;

  return (
    <div className={cn('relative', className)}>
      <div className={typingSurfacePadding}>
        <div
          className={cn('relative overflow-hidden', !windowHeightPx && size.typingMin)}
          style={windowHeightPx ? { height: windowHeightPx } : undefined}
        >
          <div
            className={cn(
              'typing-face pointer-events-none select-none whitespace-pre-wrap break-words',
              motionTokens.transitionUi,
              typingSurfaceTypography,
            )}
            style={{ transform: `translateY(-${lineScroll.offsetPx}px)` }}
            aria-hidden
          >
            {spans.map((span, spanIndex) => (
              <ReferenceSpan
                key={`${span.startIndex}-${span.text}`}
                span={span}
                index={spanIndex}
                typedText={input.slice(span.startIndex, span.startIndex + span.text.length)}
                isCurrentWord={!span.isWhitespace && spanIndex === currentSpanIndex}
                setSpanRef={setSpanRef}
              />
            ))}
          </div>
        </div>
      </div>

      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        readOnly={readOnly}
        onPaste={handlePaste}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        aria-label="Typing area"
        className={cn(
          'absolute inset-0 h-full w-full resize-none overflow-hidden border-0 bg-transparent',
          'typing-face text-transparent caret-primary',
          'focus:outline-none focus-visible:ring-0',
          typingSurfaceTypography,
          typingSurfacePadding,
        )}
      />
    </div>
  );
};

export default TypingSurface;
