import React from 'react';
import { getAccuracyColorClass } from '@/lib/theme-display-utils';

interface TextPreviewProps {
  text: string;
  userInput: string;
  className?: string;
}

const TextPreview: React.FC<TextPreviewProps> = ({
  text,
  userInput,
  className = '',
}) => {
  const textArr = text.split('');

  return (
    <div className={`px-3 ${className}`}>
      {textArr.map((s, i) => {
        let highlightColor = '';
        if (i < userInput.length) {
          const isCorrect = s === userInput[i];
          highlightColor = getAccuracyColorClass(isCorrect);
        }
        return (
          <span
            key={i}
            className={`${
              highlightColor
                ? highlightColor + ' opacity-80 dark:text-black'
                : ''
            }`}
          >
            {s}
          </span>
        );
      })}
    </div>
  );
};

export default TextPreview;
