'use client';

import React from 'react';
import AppHeader from '@/shared/ui/AppHeader';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  /** Forwarded to AppHeader's action slot — e.g. a "View stats" trigger. */
  headerActions?: React.ReactNode;
}

export function AppShell({ children, className, headerActions }: AppShellProps) {
  return (
    <div className={cn(layoutClasses.pageShell, className)}>
      <AppHeader className="shrink-0" actions={headerActions} />
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
