import React from 'react';

interface PreviewProps {
  text: string;
  userInput: string;
}

const Preview = (props: PreviewProps) => {
  const { text, userInput } = props;
  const textArr = text.split('');
  return (
    <div className='px-3'>
      {textArr.map((s, i) => {
        let highlightColor = '';
        if (i < userInput.length) {
          const isCorrect = s === userInput[i];
          highlightColor = isCorrect
            ? 'bg-[hsl(var(--good))]'
            : 'bg-[hsl(var(--needs-improvement))]';
        }
        return (
          <span
            key={i}
            className={`${
              highlightColor ? highlightColor + ' opacity-80 dark:text-black' : ''
            }`}
          >
            {s}
          </span>
        );
      })}
    </div>
  );
};

export default Preview;
