import React from 'react';
import TextPreview from '@/shared/ui/TextPreview';
import TypingInput from '@/shared/ui/TypingInput';
import ActionButton from '@/shared/ui/ActionButton';
import { ResetIcon } from '@radix-ui/react-icons';
import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/lib/cn';
import { gradients } from '@/shared/lib/theme';

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

const TypingArea: React.FC<TypingAreaProps> = ({
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
    <section className={cn('w-full', className)}>
      <Card className='relative overflow-hidden'>
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-[2px]',
            gradients.primaryLinear,
          )}
        />
        <CardContent className='p-6 md:p-8'>
          <div className='max-w-4xl text-base md:text-lg lg:text-xl leading-relaxed'>
            <div className='w-full space-y-4'>
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
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TypingArea;
