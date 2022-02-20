import { useEffect, useState } from "react";
import Preview from "./components/Preview";
import Clock from "./components/Clock";
import getText from "./getText";

const AVG_WORD_LEN = 5;

function App() {
  const defaultText = getText();
  const [text, setText] = useState<string>(defaultText);
  const [timer, setTimer] = useState<number>(60);
  const [userInput, setUserInput] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [correctWordCount, setCorrectWordCount] = useState<number>(0);
  const [totalWordCount, setTotalWordCount] = useState<number>(0);

  // useEffect(() => {
  //   if (finished) {
  //     const calcWpm = Math.round(
  //       correctWordCount / (AVG_WORD_LEN * (1 - timer / 60))
  //     );
  //     setWpm(calcWpm);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [finished]);

  function onRestart() {
    setText(defaultText);
    setCorrectWordCount(0);
    setTotalWordCount(0);
    setUserInput("");
    setStarted(false);
    setFinished(false);
  }

  function onInputChange(e: any) {
    const v = e.target.value;
    const isCorrect = e.nativeEvent.data === text[v.length - 1];
    handleWordCount(isCorrect);
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

  function handleWordCount(isCorrect: boolean) {
    setTotalWordCount((prev) => prev + 1);
    if (isCorrect) {
      setCorrectWordCount((prev) => prev + 1);
    }
  }

  return (
    <div className="bg-gray-200 flex flex-col items-center justify-center min-h-screen">
      <header className="flex w-full max-w-6xl items-center justify-center">
        <div className="flex space-x-1 px-3 py-3 items-center ">
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
        {finished && (
          <div className="w-full text-center space-y-4 mb-10">
            <h2 className="font-bold text-xl">Stats:</h2>
            <div className="flex flex-col w-full justify-between items-center space-y-4 sm:flex-row">
              <div className="sm:text-left">
                <p className="text-4xl">
                  {Math.round(
                    correctWordCount / (AVG_WORD_LEN * (1 - timer / 60))
                  ) || 0}
                </p>
                <p> words per minute</p>
              </div>
              <div className="sm:text-right">
                <p className="text-4xl">
                  {Math.round((correctWordCount / totalWordCount) * 100) || 0}%
                </p>
                <p>Accuracy</p>
              </div>
            </div>
          </div>
        )}
        <Preview text={text} userInput={userInput} />
        <textarea
          className="w-full px-3 py-3 resize-none"
          placeholder="Start typing..."
          value={userInput}
          onChange={onInputChange}
          readOnly={finished}
        />
        <div className="flex w-full">
          <button
            className="rounded bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed px-2 py-2 text-white self-end"
            onClick={onRestart}
            disabled={!started}
          >
            Restart
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
