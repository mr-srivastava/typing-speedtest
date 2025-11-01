import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { themeColors } from '@/lib/utils';

interface TypingInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly: boolean;
  disablePaste?: boolean;
  className?: string;
}

const TypingInput: React.FC<TypingInputProps> = ({
  value,
  onChange,
  readOnly,
  disablePaste = true,
  className = '',
}) => {
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (disablePaste) {
      e.preventDefault();
    }
  };

  return (
    <Textarea
      className={`w-full rounded-lg min-h-[250px] overflow-hidden px-4 py-3 resize-none mt-2 bg-secondary/60 border border-border text-base md:text-lg font-mono caret-[${themeColors.primary}] focus-visible:ring-2 focus-visible:ring-[${themeColors.primary}] focus-visible:border-transparent ${className}`}
      placeholder='Start typing for the test to begin'
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      onPaste={handlePaste}
    />
  );
};

export default TypingInput;
