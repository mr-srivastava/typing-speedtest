import type { MetricsDisplayModel } from '@/modules/metrics';

export function getMetricsModalTitle(
  model: MetricsDisplayModel,
  options: { locked: boolean; hasLiveMetrics: boolean },
): string {
  if (options.locked && model.view.scope === 'cumulative') {
    return 'Your Stats';
  }

  if (model.view.scope === 'live' || (!model.showingCumulative && options.hasLiveMetrics)) {
    return 'Test Complete';
  }

  return 'Metrics';
}

export function getMetricsModalActionLabel(model: MetricsDisplayModel, locked: boolean): string {
  if ((locked && model.view.scope === 'cumulative') || model.showingCumulative) {
    return 'Close';
  }

  return 'Restart';
}
