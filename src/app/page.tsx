'use client';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className='min-h-screen w-full bg-background relative flex flex-col antialiased'>
      <Header />
      <div className='max-w-3xl mx-auto px-6 md:px-8 py-10 md:py-20 text-center'>
        <h1 className='relative z-10 text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight'>
          <span className='bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500'>
            Unleash Your
          </span>
          <br />
          <span className='text-[hsl(var(--primary))]'>Typing Fury!</span>
        </h1>
        <p className='text-muted-foreground max-w-xl mx-auto mt-6 text-lg md:text-xl relative z-10'>
          Ready to dominate the keyboard? Our fun typing speed test will put
          your skills to the test.
        </p>
        <div className='flex items-center justify-center relative gap-x-6 pt-10 z-10'>
          <Button variant={'default'} asChild>
            <Link href={'/octane'} className='whitespace-nowrap'>
              Think You&apos;re Fast? Prove It!
            </Link>
          </Button>
        </div>
      </div>
      {/* subtle primary glow */}
      <div className='pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary))_0%,_transparent_55%)] opacity-10' />
      <BackgroundBeams />
    </div>
  );
}
