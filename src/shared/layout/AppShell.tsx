'use client';

import React from 'react';
import AppHeader from '@/shared/ui/AppHeader';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className={cn(layoutClasses.pageShell, className)}>
      <AppHeader className="shrink-0" />
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
