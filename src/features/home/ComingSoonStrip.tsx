import React from 'react';
import { getFeatureListClasses } from '@/features/metrics/metrics-display-utils';
import { cn } from '@/shared/lib/cn';

interface ComingSoonStripProps {
  hasSession: boolean;
  className?: string;
}

const FEATURES = ['Global Leaderboards', 'Progress Tracking', 'Custom Challenges'];

const ComingSoonStrip: React.FC<ComingSoonStripProps> = ({ hasSession, className = '' }) => {
  const classes = getFeatureListClasses();

  return (
    <div className={cn('w-full max-w-3xl border-t border-border/50 pt-4 text-center', className)}>
      <p className="mb-2 text-xs text-muted-foreground sm:text-sm">
        {hasSession ? 'More Features Coming Soon' : 'Coming Soon'}
      </p>
      <div className={classes.container}>
        {FEATURES.map((feature) => (
          <div key={feature} className={classes.item}>
            <div className={classes.bullet} />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      {hasSession ? (
        <p className="mt-2 text-xs text-muted-foreground/60">
          Your scores are currently stored locally. Persistent tracking coming soon!
        </p>
      ) : null}
    </div>
  );
};

export default ComingSoonStrip;
