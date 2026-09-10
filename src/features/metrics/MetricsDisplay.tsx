import React from 'react';
import WpmHistoryChart from '@/features/metrics/WpmHistoryChart';
import LetterAccuracyChart from '@/features/metrics/LetterAccuracyChart';
import PracticeRecord from '@/features/metrics/PracticeRecord';
import type { MetricsDisplayModel } from '@/modules/metrics/types';
import { cn } from '@/shared/lib/cn';

interface MetricsDisplayProps {
  model: MetricsDisplayModel;
  /** Compact charts for modal results */
  compact?: boolean;
  className?: string;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  model,
  compact = false,
  className = '',
}) => {
  const paceDescription =
    model.consistency === undefined
      ? null
      : model.consistency >= 80
        ? 'Your speed stayed steady throughout the test.'
        : model.consistency >= 60
          ? 'Your speed varied; fewer pauses will make it steadier.'
          : 'Your speed changed sharply; start slower and settle into a rhythm.';

  return (
    <div className={cn('w-full text-center', compact ? 'space-y-5' : 'space-y-6', className)}>
      <section
        className="mx-auto grid max-w-2xl grid-cols-[1.15fr_1fr] divide-x divide-border/70"
        aria-label="Performance summary"
      >
        <div className="pr-5 text-left">
          <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {model.showingCumulative ? 'Adjusted speed' : 'Final score'}
          </p>
          <p className="typing-face mt-1 text-4xl font-semibold tabular-nums tracking-tight">
            {model.wpm}
            <span className="ml-1 text-base font-medium text-muted-foreground">WPM</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Raw speed {model.rawWpm} WPM</p>
        </div>
        <div className="pl-5 text-left">
          <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Accuracy
          </p>
          <p className="typing-face mt-1 text-4xl font-semibold tabular-nums tracking-tight">
            {model.characterAccuracy}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {model.wordAccuracy}% whole words correct
          </p>
        </div>
        <div className="col-span-2 mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-1 text-foreground">
            −{model.correctionCost} WPM to corrections
          </span>
          {model.baselineWpm !== undefined ? (
            <span>
              {model.wpm - model.baselineWpm >= 0 ? '+' : ''}
              {model.wpm - model.baselineWpm} WPM compared with similar recent tests
            </span>
          ) : null}
        </div>
      </section>

      {paceDescription ? (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Pace stability {model.consistency}%.</span>{' '}
          {paceDescription}
        </p>
      ) : null}

      {model.coaching ? (
        <section
          className="mx-auto max-w-2xl border-y border-border/70 py-3 text-left"
          aria-label="Next practice focus"
        >
          <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Next practice focus
          </p>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="text-sm font-semibold">{model.coaching.title}</h3>
            <p className="text-xs text-muted-foreground">{model.coaching.detail}</p>
          </div>
        </section>
      ) : null}

      {model.wpmSeries && model.wpmSeries.length > 0 && !model.showingCumulative ? (
        <section className="mx-auto max-w-2xl" aria-label="Pace over time">
          <WpmHistoryChart
            data={model.wpmSeries}
            paceBuckets={model.paceBuckets}
            correctionClusters={model.correctionClusters}
            compact
          />
        </section>
      ) : null}

      {!model.showingCumulative ? (
        <details className="mx-auto max-w-2xl border-t border-border/70 pt-3 text-left">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
            Inspect key accuracy
          </summary>
          <LetterAccuracyChart
            key={model.view.scope}
            letterAccuracyData={model.letterAccuracy}
            large={false}
            keyTelemetry={model.keyTelemetry}
          />
        </details>
      ) : (
        <PracticeRecord sessions={model.recentSessions} />
      )}
    </div>
  );
};

export default MetricsDisplay;
