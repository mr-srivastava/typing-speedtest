'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import ThemeToggle from '@/shared/ui/ThemeToggle';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';

interface AppHeaderProps {
  variant?: 'default' | 'minimal';
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  variant = 'default',
  className = '',
}) => {
  const isMinimal = variant === 'minimal';

  return (
    <header className={cn('w-full', className)}>
      <div
        className={cn(
          layoutClasses.contentShell,
          layoutClasses.containerPadding,
          'h-16 md:h-20',
          layoutClasses.flexBetween,
        )}
      >
        <Button
          className={cn(
            layoutClasses.flexStart,
            'space-x-2 px-2 md:px-3 py-2 hover:bg-transparent',
          )}
          variant='ghost'
          asChild
        >
          <Link href='/'>
            <Image src='/logo.svg' alt='Logo' width={36} height={36} />
            <span className='w-max font-bold whitespace-nowrap text-base md:text-lg'>
              Octane Type
            </span>
          </Link>
        </Button>

        <div className={cn(layoutClasses.flexStart, layoutClasses.gap2)}>
          {!isMinimal ? (
            <Button
              variant='ghost'
              disabled
              className='text-muted-foreground hidden sm:flex'
            >
              Leaderboard
              <span className='ml-1 text-xs'>(Soon)</span>
            </Button>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
