import React from "react";

interface PreviewProps {
  text: string;
  userInput: string;
}

const Preview = (props: PreviewProps) => {
  const { text, userInput } = props;
  const textArr = text.split("");
  return (
    <div className="px-3">
      {textArr.map((s, i) => {
        let hightlightColor = "";
        if (i < userInput.length) {
          hightlightColor = s === userInput[i] ? "bg-green-300" : "bg-red-300";
        }
        return (
          <span key={i} className={`${hightlightColor}`}>
            {s}
          </span>
        );
      })}
    </div>
  );
};

export default Preview;
