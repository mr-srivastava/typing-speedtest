import React from 'react';
import TextPreview from '@/components/atoms/TextPreview';
import TypingInput from '@/components/atoms/TypingInput';
import ActionButton from '@/components/atoms/ActionButton';
import { ResetIcon } from '@radix-ui/react-icons';

export interface TypingAreaProps {
  text: string;
  userInput: string;
  onInputChange: (value: string) => void;
  readOnly: boolean;
  disablePaste?: boolean;
  showRestart?: boolean;
  onRestart?: () => void;
  restartDisabled?: boolean;
  className?: string;
}

const TypingTestInterface: React.FC<TypingAreaProps> = ({
  text,
  userInput,
  onInputChange,
  readOnly,
  disablePaste = true,
  showRestart = false,
  onRestart,
  restartDisabled = false,
  className = '',
}) => {
  return (
    <div className={`w-full space-y-4 ${className}`}>
      <div className='w-full rounded-lg bg-secondary/60 border border-border p-4 text-base md:text-lg font-mono leading-relaxed'>
        <TextPreview text={text} userInput={userInput} />
      </div>

      <div className='relative'>
        <TypingInput
          value={userInput}
          onChange={onInputChange}
          readOnly={readOnly}
          disablePaste={disablePaste}
        />

        {showRestart && onRestart ? (
          <div className='flex w-full justify-end mt-3'>
            <ActionButton
              variant='outline'
              size='icon'
              onClick={onRestart}
              disabled={restartDisabled}
              icon={<ResetIcon />}
              className='rounded-lg'
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TypingTestInterface;
