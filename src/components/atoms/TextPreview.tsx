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

  const lastTypedIndex = userInput.length > 0 ? userInput.length - 1 : -1;

  return (
    <div className={`px-3 ${className}`}>
      {textArr.map((s, i) => {
        let highlightColor = '';
        if (i < userInput.length) {
          const isCorrect = s === userInput[i];
          highlightColor = getAccuracyColorClass(isCorrect);
        }
        const isJustTyped = i === lastTypedIndex;
        return (
          <span
            key={i}
            className={`inline-block transition-colors duration-150 ${
              highlightColor
                ? highlightColor + ' opacity-80 dark:text-black'
                : ''
            } ${isJustTyped ? 'animate-character-feedback' : ''}`}
          >
            {s}
          </span>
        );
      })}
    </div>
  );
};

export default TextPreview;
