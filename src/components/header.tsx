import React, { Dispatch, SetStateAction } from "react";
import Clock from "./clock";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

interface IHeaderProps {
  timer: number;
  setTimer: Dispatch<SetStateAction<number>>;
  started: boolean;
  finished: boolean;
  handleTimerExpiry: () => void;
}

const Header = (props: IHeaderProps) => {
  const { timer, setTimer, started, finished, handleTimerExpiry } = props;
  return (
    <header className="flex w-full max-w-6xl items-center justify-center mb-10">
      <Button
        className="flex space-x-1 px-3 py-3 items-center hover:bg-transparent"
        variant={"ghost"}
        asChild
      >
        <Link href={"/"}>
          <Image src="/logo.svg" alt="Logo" width={24} height={24} />
          <span className="w-max font-bold whitespace-nowrap">
            Typing Speedtest
          </span>
        </Link>
      </Button>
      <Clock
        timer={timer}
        setTimer={setTimer}
        started={started}
        finished={finished}
        handleTimerExpiry={handleTimerExpiry}
      />
    </header>
  );
};

export default Header;
