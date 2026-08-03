import React from 'react';
import { Textarea } from '@/shared/ui/textarea';
import { cn } from '@/shared/lib/cn';

interface TypingInputProps {
  value: string;
  onChange: (value: string) => void;
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
      className={cn(
        'w-full rounded-lg min-h-[250px] overflow-hidden px-4 py-3 resize-none mt-2 bg-secondary/60 border border-border text-base md:text-lg font-mono caret-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent',
        className,
      )}
      placeholder='Start typing for the test to begin'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      onPaste={handlePaste}
    />
  );
};

export default TypingInput;
