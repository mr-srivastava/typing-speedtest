import { useEffect, useState } from "react";
import Preview from "./components/Preview";
import Clock from "./components/Clock";
import getText from "./getText";

function App() {
  const defaultText = getText();
  const [text, setText] = useState<string>(defaultText);
  const [timer, setTimer] = useState<number>(60);
  const [userInput, setUserInput] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);

  useEffect(() => {
    if (finished) {
      const w = getCorrectSymbols();
      const calcWpm = Math.round(w / (1 - timer / 60));
      setWpm(calcWpm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, timer]);

  function getCorrectSymbols() {
    return userInput.split(" ").filter((w, idx) => w === text.split(" ")[idx])
      .length;
  }

  function onRestart() {
    setText(defaultText);
    setWpm(0);
    setUserInput("");
    setStarted(false);
    setFinished(false);
  }

  function onInputChange(e: any) {
    const v = e.target.value;
    startTimer();
    setUserInput(v);
    checkIfFinished(v);
  }

  function startTimer() {
    setStarted(true);
  }

  function checkIfFinished(input: string) {
    if (input.split("").length === text.split("").length) {
      setFinished(true);
    }
  }

  return (
    <div className="bg-gray-200 flex flex-col items-center justify-center min-h-screen">
      <header className="flex w-full max-w-6xl items-center justify-center">
        <div className="flex space-x-1 items-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#34EBAE"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="w-max font-bold">Typing Speedtest</p>
        </div>
        <Clock
          timer={timer}
          setTimer={setTimer}
          started={started}
          finished={finished}
          handleTimerExpiry={() => {
            setFinished(true);
          }}
        />
      </header>
      <main className="w-full flex-1 max-w-6xl flex flex-col items-center justify-center px-4 space-y-4">
        <Preview text={text} userInput={userInput} />
        <textarea
          className="w-full px-3 py-3 resize-none"
          placeholder="Start typing..."
          value={userInput}
          onChange={onInputChange}
          readOnly={finished}
        />
        <div className="flex justify-between w-full px-1">
          <p>{wpm} WPM</p>
          <button
            className="rounded bg-blue-600 px-2 py-2 text-white"
            onClick={onRestart}
          >
            Restart
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
