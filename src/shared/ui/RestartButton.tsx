import React from 'react';
import { Button } from '@/shared/ui/button';
import { ResetIcon } from '@radix-ui/react-icons';
import { cn } from '@/shared/lib/cn';

interface RestartButtonProps {
  onRestart: () => void;
  disabled: boolean;
  className?: string;
}

const RestartButton: React.FC<RestartButtonProps> = ({
  onRestart,
  disabled,
  className = '',
}) => {
  return (
    <div className={cn('flex w-full justify-end mt-5', className)}>
      <Button
        variant='outline'
        className='rounded-lg'
        size='icon'
        onClick={onRestart}
        disabled={disabled}
      >
        <ResetIcon />
      </Button>
    </div>
  );
};

export default RestartButton;
