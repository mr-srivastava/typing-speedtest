import React, { Dispatch, SetStateAction } from 'react';
import Clock from './clock';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import RestartButton from './restart-button';

interface IHeaderProps {
  timer?: number;
  setTimer?: Dispatch<SetStateAction<number>>;
  started?: boolean;
  finished?: boolean;
  handleTimerExpiry?: () => void;
  showRestart?: boolean;
  onRestart?: () => void;
  restartDisabled?: boolean;
}

const Header = (props: IHeaderProps) => {
  const {
    timer,
    setTimer,
    started,
    finished,
    handleTimerExpiry,
    showRestart,
    onRestart,
    restartDisabled,
  } = props;
  return (
    <header className='w-full'>
      <div className='mx-auto max-w-6xl px-6 md:px-8 flex items-center justify-between h-16 md:h-20'>
        <Button
          className='flex space-x-2 px-2 md:px-3 py-2 items-center hover:bg-transparent'
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
        <div className='flex items-center gap-2'>
          {typeof timer === 'number' && setTimer && handleTimerExpiry ? (
            <Clock
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
        </div>
      </div>
    </header>
  );
};

export default Header;
