import React from 'react';
import TypingTestInterface from '@/components/organisms/TypingTestInterface';
import { Card, CardContent } from '@/components/ui/card';
import { gradients } from '@/lib/utils';

interface TypingSectionProps {
  text: string;
  userInput: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly: boolean;
  disablePaste?: boolean;
  showRestart?: boolean;
  onRestart?: () => void;
  restartDisabled?: boolean;
  className?: string;
}

const TypingSection: React.FC<TypingSectionProps> = ({
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
    <section className={`w-full ${className}`}>
      <Card className='relative overflow-hidden'>
        {/* Top gradient accent */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${gradients.primaryLinear}`}
        />
        <CardContent className='p-6 md:p-8'>
          <div className='max-w-4xl text-base md:text-lg lg:text-xl leading-relaxed'>
            <TypingTestInterface
              text={text}
              userInput={userInput}
              onInputChange={onInputChange}
              readOnly={readOnly}
              disablePaste={disablePaste}
              showRestart={showRestart}
              onRestart={onRestart}
              restartDisabled={restartDisabled}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TypingSection;
