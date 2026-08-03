'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import {
  getCharStatus,
  getCurrentWordSpanIndex,
  parseReferenceSpans,
  typingSurfacePadding,
  typingSurfaceTypography,
} from '@/features/typing-test/typing-surface-utils';
import { getAccuracyColorClass } from '@/shared/layout/theme-display-utils';
import { cn } from '@/shared/lib/cn';

interface TypingSurfaceProps {
  referenceText: string;
  input: string;
  onInputChange: (value: string) => void;
  readOnly: boolean;
  focusKey?: string;
  className?: string;
}

function getCharClassName(
  referenceText: string,
  input: string,
  index: number,
): string {
  const status = getCharStatus(referenceText, input, index);

  switch (status) {
    case 'correct':
      return cn(getAccuracyColorClass(true), 'opacity-90 dark:text-black');
    case 'incorrect':
      return cn(getAccuracyColorClass(false), 'opacity-90 dark:text-black');
    case 'cursor':
      return 'bg-primary/25 rounded-sm';
    case 'pending':
      return 'text-muted-foreground';
  }
}

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

  const spans = useMemo(
    () => parseReferenceSpans(referenceText),
    [referenceText],
  );

  const cursorIndex = input.length;
  const currentSpanIndex = getCurrentWordSpanIndex(spans, cursorIndex);

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
    <div
      className={cn(
        'relative min-h-[12rem] max-h-[40vh] overflow-y-auto',
        className,
      )}
    >
      <div
        className={cn(
          'pointer-events-none select-none whitespace-pre-wrap break-words',
          typingSurfaceTypography,
          typingSurfacePadding,
        )}
        aria-hidden
      >
        {spans.map((span, spanIndex) => {
          const isCurrentWord =
            !span.isWhitespace && spanIndex === currentSpanIndex;

          return (
            <span
              key={`${span.startIndex}-${span.text}`}
              ref={(el) => {
                spanRefs.current[spanIndex] = el;
              }}
              className={cn(isCurrentWord && 'rounded bg-primary/10 px-0.5')}
            >
              {span.text.split('').map((char, charIndex) => {
                const globalIndex = span.startIndex + charIndex;
                return (
                  <span
                    key={globalIndex}
                    className={cn(
                      'transition-colors duration-150',
                      getCharClassName(referenceText, input, globalIndex),
                    )}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          );
        })}
      </div>

      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        readOnly={readOnly}
        onPaste={handlePaste}
        spellCheck={false}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        aria-label='Typing area'
        className={cn(
          'absolute inset-0 h-full w-full resize-none overflow-hidden border-0 bg-transparent',
          'text-transparent caret-primary',
          'focus:outline-none focus-visible:ring-0',
          typingSurfaceTypography,
          typingSurfacePadding,
        )}
      />
    </div>
  );
};

export default TypingSurface;
