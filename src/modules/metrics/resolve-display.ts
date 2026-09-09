import type { EnhancedStoredData } from '@/modules/session/types';
import type { LetterMetrics } from '@/modules/typing-test/types';
import { calculateCurrentAccuracy, calculateWpm, resolveLiveElapsedSeconds } from './calculate';
import type { LiveTestMetrics, MetricsDisplayModel, MetricsPreference, MetricsView } from './types';

const EMPTY_LIVE: LiveTestMetrics = {
  correctWordCount: 0,
  totalWordCount: 0,
  correctChars: 0,
  typedChars: 0,
  mode: 'time',
  timerRemaining: 0,
  timerDuration: 60,
  letterAccuracy: {},
};

function resolveView(
  session: EnhancedStoredData | null,
  preference: MetricsPreference,
  locked: boolean,
): MetricsView {
  const canToggle = Boolean(session && session.cumulative.totalTests >= 2);

  if (locked) {
    if (preference === 'cumulative') return { scope: 'cumulative' };
    return { scope: 'live' };
  }

  if (canToggle) {
    if (preference === 'cumulative') {
      return { scope: 'toggle', initial: 'cumulative' };
    }
    return { scope: 'toggle', initial: 'live' };
  }

  if (preference === 'cumulative') {
    return { scope: 'cumulative' };
  }

  return { scope: 'live' };
}

function resolveShowingCumulative(
  view: MetricsView,
  preference: MetricsPreference,
  canToggle: boolean,
): boolean {
  if (view.scope === 'cumulative') return true;
  if (view.scope === 'live') return false;
  // toggle
  if (preference === 'cumulative' && canToggle) return true;
  if (preference === 'live') return false;
  return view.initial === 'cumulative' && canToggle;
}

function generateStatsTitle(
  session: EnhancedStoredData | null,
  showingCumulative: boolean,
): string | null {
  if (showingCumulative && session) {
    const { totalTests, totalTimeSpent } = session.cumulative;
    const totalMinutes = Math.round(totalTimeSpent / 60);
    return `${totalTests} tests • ${totalMinutes} minutes total`;
  }
  return null;
}

function resolveLetterAccuracy(
  live: LiveTestMetrics,
  session: EnhancedStoredData | null,
  showingCumulative: boolean,
): Record<string, LetterMetrics> {
  if (showingCumulative && session?.cumulative.letterStats) {
    const hasData = Object.values(session.cumulative.letterStats).some(
      (metrics) => metrics.total > 0,
    );
    if (hasData) {
      return session.cumulative.letterStats;
    }
  }
  return live.letterAccuracy;
}

export function resolveMetricsDisplay(input: {
  live?: LiveTestMetrics;
  session: EnhancedStoredData | null;
  preference?: MetricsPreference;
  /** When true, preference becomes a fixed scope (no toggle UI). */
  locked?: boolean;
}): MetricsDisplayModel {
  const live = input.live ?? EMPTY_LIVE;
  const preference = input.preference ?? 'auto';
  const locked = input.locked ?? false;
  const session = input.session;
  const canToggle = Boolean(session && session.cumulative.totalTests >= 2);
  const view = resolveView(session, preference, locked);
  const showingCumulative = resolveShowingCumulative(view, preference, canToggle);

  const liveElapsedSeconds = resolveLiveElapsedSeconds(live);

  const wpm =
    showingCumulative && session
      ? session.cumulative.weightedWPM
      : calculateWpm(live.correctChars, liveElapsedSeconds);

  const rawWpm =
    showingCumulative && session
      ? (session.cumulative.weightedRawWPM ?? session.cumulative.weightedWPM)
      : calculateWpm(live.typedChars, liveElapsedSeconds);

  const accuracy =
    showingCumulative && session
      ? session.cumulative.weightedAccuracy
      : calculateCurrentAccuracy(live.correctWordCount, live.totalWordCount);

  const consistency = showingCumulative
    ? session?.cumulative.weightedConsistency
    : live.consistency;

  return {
    wpm,
    rawWpm,
    accuracy,
    letterAccuracy: resolveLetterAccuracy(live, session, showingCumulative),
    statsTitle: generateStatsTitle(session, showingCumulative),
    view,
    canToggle: view.scope === 'toggle',
    showingCumulative,
    totalTests: session?.cumulative.totalTests ?? 0,
    consistency,
    // A WPM-over-time history only makes sense for one finished test, not an aggregate.
    wpmSeries: showingCumulative ? undefined : live.wpmSeries,
  };
}
