import React from 'react';
import TimerDisplay from '@/shared/ui/TimerDisplay';
import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import RestartButton from '@/shared/ui/RestartButton';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';

interface AppHeaderProps {
  timer?: number;
  showRestart?: boolean;
  onRestart?: () => void;
  restartDisabled?: boolean;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  timer,
  showRestart,
  onRestart,
  restartDisabled,
  className = '',
}) => {
  return (
    <header className={cn('w-full', className)}>
      <div
        className={cn(
          'mx-auto max-w-6xl px-6 md:px-8 h-16 md:h-20',
          layoutClasses.flexBetween,
        )}
      >
        <Button
          className={cn(
            layoutClasses.flexStart,
            'space-x-2 px-2 md:px-3 py-2 hover:bg-transparent',
          )}
          variant={'ghost'}
          asChild
        >
          <Link href={'/'}>
            <Image src='/logo.svg' alt='Logo' width={36} height={36} />
            <span className='w-max font-bold whitespace-nowrap text-base md:text-lg'>
              Octane Type
            </span>
          </Link>
        </Button>
        <div className={cn(layoutClasses.flexStart, layoutClasses.gap2)}>
          {typeof timer === 'number' ? <TimerDisplay timer={timer} /> : null}
          {showRestart && onRestart ? (
            <RestartButton onRestart={onRestart} disabled={!!restartDisabled} />
          ) : null}
          {/* Future feature placeholder - Leaderboard */}
          <Button
            variant='ghost'
            disabled
            className='text-muted-foreground hidden sm:flex'
          >
            Leaderboard
            <span className='ml-1 text-xs'>(Soon)</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
