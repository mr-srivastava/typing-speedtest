import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { buttonClasses, animationClasses } from '@/lib/layout-utils';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      children,
      loading = false,
      loadingText,
      icon,
      iconPosition = 'left',
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          buttonClasses.actionWithIcon,
          loading && 'opacity-70 cursor-not-allowed',
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <div className={animationClasses.spinner} />
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </Button>
    );
  },
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
