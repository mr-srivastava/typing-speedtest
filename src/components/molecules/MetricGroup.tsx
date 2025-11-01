import React from 'react';
import MetricBadge from '@/components/atoms/MetricBadge';
import { layoutClasses } from '@/lib/layout-utils';

interface MetricItem {
  value: string | number;
  label?: string;
  variant?: 'success' | 'default' | 'muted';
}

interface MetricGroupProps {
  metrics: MetricItem[];
  separator?: string;
  className?: string;
  itemClassName?: string;
}

const MetricGroup: React.FC<MetricGroupProps> = ({
  metrics,
  separator = '•',
  className = '',
  itemClassName = '',
}) => {
  return (
    <div
      className={`${layoutClasses.flexStart} ${layoutClasses.gap2} ${className}`}
    >
      {metrics.map((metric, index) => (
        <React.Fragment key={index}>
          <MetricBadge
            value={metric.value}
            label={metric.label}
            variant={metric.variant}
            className={itemClassName}
          />
          {index < metrics.length - 1 && (
            <span className='text-muted-foreground'>{separator}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MetricGroup;
