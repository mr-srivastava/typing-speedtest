"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <>
      <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
            Typing Speedtest
          </h1>
          <p></p>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Welcome to the Typing Speedtest
          </p>
          <div className="flex items-center justify-center gap-x-16 pt-10">
            <Button asChild>
              <Link href={"/octane"}>Quick Test</Link>
            </Button>

            <Button variant={"secondary"}>Custom Test</Button>
          </div>
        </div>
      </div>
    </>
  );
}
