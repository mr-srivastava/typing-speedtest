"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/moving-border";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold leading-tight md:leading-tight">
          Unleash Your Typing Fury!
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-md  mt-5 text-center relative z-10">
          Ready to dominate the keyboard? Our fun typing speed test will put
          your skills to the test.
        </p>
        <div className="flex items-center justify-center relative gap-x-16 pt-10 z-10">
          <Button variant={"secondary"} asChild>
            <Link href={"/octane"} className="whitespace-nowrap">
              Think You&apos;re Fast? Prove It!
            </Link>
          </Button>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
