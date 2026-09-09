'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  getCurrentWordSpanIndex,
  parseReferenceSpans,
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

  useEffect(() => {
    const current = spanRefs.current[currentSpanIndex];
    current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentSpanIndex, focusKey]);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  return (
    <div className={cn(`relative ${size.typingMin} max-h-[40vh] overflow-y-auto`, className)}>
      <div
        className={cn(
          'typing-face pointer-events-none select-none whitespace-pre-wrap break-words',
          typingSurfaceTypography,
          typingSurfacePadding,
        )}
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
