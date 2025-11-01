import React from 'react';
import MetricsDisplay from '@/components/organisms/MetricsDisplay';
import { LetterMetrics, EnhancedStoredData } from '@/types/metrics';

interface MetricsSectionProps {
  correctWordCount: number;
  totalWordCount: number;
  timer: number;
  letterAccuracyData: Record<string, LetterMetrics>;
  sessionData?: EnhancedStoredData | null;
  showCumulative?: boolean;
  showOverallStats?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({
  correctWordCount,
  totalWordCount,
  timer,
  letterAccuracyData,
  sessionData,
  showCumulative = false,
  showOverallStats = false,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <section className={`w-full ${className}`}>
      {/* Section Header */}
      {(title || subtitle) && (
        <div className='text-center mb-6 space-y-2'>
          {title && (
            <h2 className='text-2xl md:text-3xl font-bold text-foreground'>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className='text-muted-foreground text-sm md:text-base'>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Metrics Display */}
      <MetricsDisplay
        correctWordCount={correctWordCount}
        totalWordCount={totalWordCount}
        timer={timer}
        letterAccuracyData={letterAccuracyData}
        data={sessionData}
        showCumulative={showCumulative}
        showOverallStats={showOverallStats}
      />
    </section>
  );
};

export default MetricsSection;
