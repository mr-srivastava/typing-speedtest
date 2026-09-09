import type { MetricsDisplayModel } from '@/modules/metrics/types';

export function getMetricsModalTitle(
  model: MetricsDisplayModel,
  options: { hasLiveMetrics: boolean },
): string {
  if (model.view.scope === 'live' || (!model.showingCumulative && options.hasLiveMetrics)) {
    return 'Test Complete';
  }

  return 'Metrics';
}

export function getMetricsModalActionLabel(model: MetricsDisplayModel): string {
  if (model.showingCumulative) {
    return 'Close';
  }

  return 'Restart';
}
