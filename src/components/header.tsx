import React, { Dispatch, SetStateAction } from "react";
import Clock from "./clock";
import Image from "next/image";

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
      <div className="flex space-x-1 px-3 py-3 items-center ">
        <Image src="/logo.svg" alt="Logo" width={24} height={24} />
        <p className="w-max font-bold">Typing Speedtest</p>
      </div>
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
