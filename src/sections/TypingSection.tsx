import React from 'react';
import TypingTestInterface, {
  type TypingAreaProps,
} from '@/components/organisms/TypingTestInterface';
import { Card, CardContent } from '@/components/ui/card';
import { gradients } from '@/lib/utils';

export type { TypingAreaProps };

const TypingSection: React.FC<TypingAreaProps> = ({
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
