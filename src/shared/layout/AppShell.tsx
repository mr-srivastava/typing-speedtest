'use client';

import React from 'react';
import AppHeader from '@/shared/ui/AppHeader';
import { AmbientBackground } from '@/shared/layout/AmbientBackground';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';

interface AppShellProps {
  children: React.ReactNode;
  headerVariant?: 'default' | 'minimal';
  className?: string;
}

export function AppShell({ children, headerVariant = 'default', className }: AppShellProps) {
  return (
    <div className={cn(layoutClasses.pageShell, className)}>
      <AmbientBackground />
      <AppHeader variant={headerVariant} className="shrink-0" />
      {children}
    </div>
  );
}
