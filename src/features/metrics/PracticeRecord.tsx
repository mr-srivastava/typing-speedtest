'use client';

import { useMemo, useState } from 'react';
import type { TestSession } from '@/modules/session/types';
import { cn } from '@/shared/lib/cn';

type Filter = 'all' | 'time' | 'words' | 'punctuation' | 'numbers';
const filters: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'time', label: 'Time' },
  { value: 'words', label: 'Words' },
  { value: 'punctuation', label: 'Punctuation' },
  { value: 'numbers', label: 'Numbers' },
];

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2)
    return <span className="text-xs text-muted-foreground">Need 2+ tests</span>;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = max === min ? 50 : 90 - ((value - min) / (max - min)) * 80;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-10 w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function matchesFilter(session: TestSession, filter: Filter): boolean {
  if (filter === 'all') return true;
  if (filter === 'time' || filter === 'words') return session.config.mode === filter;
  return filter === 'punctuation'
    ? session.config.punctuationEnabled
    : session.config.numbersEnabled;
}

export default function PracticeRecord({ sessions }: { sessions: TestSession[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = useMemo(
    () =>
      sessions
        .filter((session) => matchesFilter(session, filter))
        .slice()
        .reverse(),
    [filter, sessions],
  );
  const problems = useMemo(() => {
    const errors = new Map<string, number>();
    for (const session of filtered) {
      for (const pair of session.insights.errorPairs) {
        const key = `${pair.expected}→${pair.typed}`;
        errors.set(key, (errors.get(key) ?? 0) + pair.count);
      }
    }
    return [...errors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [filtered]);
  const correctionCost = filtered.length
    ? Math.round(
        filtered.reduce((sum, session) => sum + Math.max(0, session.rawWpm - session.wpm), 0) /
          filtered.length,
      )
    : 0;

  return (
    <section
      className="mx-auto max-w-2xl border-t border-border/70 pt-4 text-left"
      aria-label="Practice record"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Practice record
        </p>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter practice record">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                'rounded-sm px-2 py-1 text-xs focus-visible:ring-2 focus-visible:ring-ring',
                filter === item.value
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Complete tests in this format to build your record.
        </p>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Adjusted WPM</p>
            <Sparkline
              values={filtered.map((session) => session.wpm)}
              color="hsl(var(--primary))"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Accuracy</p>
            <Sparkline
              values={filtered.map((session) => session.accuracy)}
              color="hsl(var(--success))"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Correction cost</p>
            <p className="mt-2 text-xl font-semibold tabular-nums">
              −{correctionCost}{' '}
              <span className="text-xs font-normal text-muted-foreground">WPM avg</span>
            </p>
          </div>
        </div>
      )}
      {problems.length > 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Most common slips:{' '}
          {problems.map(([pair, count]) => `${pair.toUpperCase()} ${count}×`).join(' · ')}
        </p>
      ) : null}
    </section>
  );
}
