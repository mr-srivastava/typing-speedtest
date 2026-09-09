'use client';
import React from 'react';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import ThemeToggle from '@/shared/ui/ThemeToggle';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';

interface AppHeaderProps {
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ className = '' }) => {
  return (
    <header className={cn('w-full', className)}>
      <div
        className={cn(
          layoutClasses.contentShell,
          layoutClasses.containerPadding,
          'h-16 border-b border-border/70 md:h-[72px]',
          layoutClasses.flexBetween,
        )}
      >
        <Button
          className={cn(layoutClasses.flexStart, 'space-x-2 px-0 py-2 hover:bg-transparent')}
          variant="ghost"
          asChild
        >
          <Link href="/">
            <span className="grid h-7 w-7 place-items-center border border-primary text-sm font-bold text-primary">
              ›_
            </span>
            <span className="w-max font-semibold whitespace-nowrap tracking-tight text-base md:text-lg">
              Octane Type
            </span>
          </Link>
        </Button>

        <div className={cn(layoutClasses.flexStart, layoutClasses.gap2)}>
          <Button
            variant="ghost"
            disabled
            className="hidden text-xs font-normal text-muted-foreground sm:flex"
          >
            leaderboard <span className="ml-1 opacity-60">soon</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
