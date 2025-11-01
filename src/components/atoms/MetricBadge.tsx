import React from 'react';
import { themeColorClasses, cn } from '@/lib/utils';

interface MetricBadgeProps {
  value: string | number;
  label?: string;
  variant?: 'success' | 'default' | 'muted';
  className?: string;
}

const MetricBadge: React.FC<MetricBadgeProps> = ({
  value,
  label,
  variant = 'default',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return `font-semibold ${themeColorClasses.success}`;
      case 'muted':
        return 'text-muted-foreground';
      default:
        return '';
    }
  };

  return (
    <span className={cn(getVariantStyles(), className)}>
      {value}
      {label && ` ${label}`}
    </span>
  );
};

export default MetricBadge;
