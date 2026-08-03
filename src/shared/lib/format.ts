function getCalendarDayDiff(from: Date, to: Date): number {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

export function formatTimeSpent(seconds: number): string {
  if (seconds <= 0) {
    return '0m';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes =
    hours > 0
      ? Math.floor((seconds % 3600) / 60)
      : Math.max(1, Math.ceil(seconds / 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function formatDateRange(firstDate: string): string {
  const first = new Date(firstDate);
  if (Number.isNaN(first.getTime())) {
    return '';
  }

  const diffDays = getCalendarDayDiff(first, new Date());

  if (diffDays === 0) {
    return 'since today';
  }
  if (diffDays === 1) {
    return 'since yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays} days`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  }

  const months = Math.floor(diffDays / 30);
  return `${months} month${months > 1 ? 's' : ''}`;
}
