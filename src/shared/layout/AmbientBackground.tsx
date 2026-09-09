'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/shared/lib/cn';
import { gradients } from '@/shared/lib/theme';

const BackgroundBeams = dynamic(
  () => import('@/shared/ui/background-beams').then((mod) => mod.BackgroundBeams),
  { ssr: false },
);

interface AmbientBackgroundProps {
  /** Decorative SVG animation is opt-in so it never competes with interactive pages. */
  animated?: boolean;
}

export function AmbientBackground({ animated = false }: AmbientBackgroundProps) {
  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <div className={cn('pointer-events-none absolute inset-0 z-[1]', gradients.primaryRadial)} />
      {animated ? <BackgroundBeams /> : null}
    </>
  );
}
