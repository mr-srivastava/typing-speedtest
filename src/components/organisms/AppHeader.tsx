import React, { Dispatch, SetStateAction } from 'react';
import TimerDisplay from '@/components/molecules/TimerDisplay';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import RestartButton from '@/components/atoms/RestartButton';
import { layoutClasses } from '@/lib/layout-utils';

interface AppHeaderProps {
  timer?: number;
  setTimer?: Dispatch<SetStateAction<number>>;
  started?: boolean;
  finished?: boolean;
  handleTimerExpiry?: () => void;
  showRestart?: boolean;
  onRestart?: () => void;
  restartDisabled?: boolean;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  timer,
  setTimer,
  started,
  finished,
  handleTimerExpiry,
  showRestart,
  onRestart,
  restartDisabled,
  className = '',
}) => {
  return (
    <header className={`w-full ${className}`}>
      <div
        className={`mx-auto max-w-6xl px-6 md:px-8 ${layoutClasses.flexBetween} h-16 md:h-20`}
      >
        <Button
          className={`${layoutClasses.flexStart} space-x-2 px-2 md:px-3 py-2 hover:bg-transparent`}
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
        <div className={`${layoutClasses.flexStart} ${layoutClasses.gap2}`}>
          {typeof timer === 'number' && setTimer && handleTimerExpiry ? (
            <TimerDisplay
              timer={timer}
              setTimer={setTimer}
              started={!!started}
              finished={!!finished}
              handleTimerExpiry={handleTimerExpiry}
            />
          ) : null}
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
