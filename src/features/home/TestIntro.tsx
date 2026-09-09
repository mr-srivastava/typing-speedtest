import React from 'react';
import { themeColorClasses } from '@/shared/lib/theme';
import { cn } from '@/shared/lib/cn';

interface TestIntroProps {
  className?: string;
}

const TestIntro: React.FC<TestIntroProps> = ({ className = '' }) => {
  return (
    <p className={cn('text-center text-sm text-muted-foreground', className)}>
      A quiet place to practice typing with{' '}
      <span className={cn('font-medium', themeColorClasses.primary)}>intention.</span>
    </p>
  );
};

export default TestIntro;
