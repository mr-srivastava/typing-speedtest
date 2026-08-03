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
    <div className={cn('flex items-center', className)}>
      <Button
        variant='outline'
        size='icon'
        className='rounded-lg'
        onClick={onRestart}
        disabled={disabled}
        aria-label='Restart test'
      >
        <ResetIcon />
      </Button>
    </div>
  );
};

export default RestartButton;
