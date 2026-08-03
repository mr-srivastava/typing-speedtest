'use client';
import { cn } from '@/shared/lib/cn';
import { radiusClasses } from '@/shared/layout/layout-utils';
import { useOutsideClick } from '@/shared/hooks/useOutsideClick';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { Button } from '@/shared/ui/button';

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const Modal = ({
  children,
  isOpen,
  onOpenChange,
}: {
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <ModalContext.Provider value={{ open: isOpen, setOpen: onOpenChange }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalBody = ({
  children,
  className,
  title,
  subtitle,
  toolbar,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  toolbar?: ReactNode;
}) => {
  const { open, setOpen } = useModal();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const modalRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(modalRef, () => setOpen(false));

  const panelTransition = reduceMotion
    ? { duration: 0.2 }
    : { type: 'spring' as const, duration: 0.4, bounce: 0.15 };

  const panelInitial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, transform: 'translateY(8px) scale(0.95)' };

  const panelAnimate = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, transform: 'translateY(0px) scale(1)' };

  const panelExit = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, transform: 'translateY(4px) scale(0.97)' };

  return (
    <AnimatePresence>
      {open ? (
        <div className='fixed inset-0 z-50 flex h-full w-full items-center justify-center p-4'>
          <Overlay />

          <motion.div
            ref={modalRef}
            className={cn(
              'relative z-50 flex w-full max-w-4xl max-h-[90%] min-h-[50%] flex-col border border-border bg-card text-card-foreground pointer-events-auto',
              radiusClasses.panel,
              className,
            )}
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelExit}
            transition={panelTransition}
          >
            <div className='flex items-start justify-between gap-4 border-b border-border p-4'>
              <div className='min-w-0'>
                {title ? (
                  <h2 className='text-xl sm:text-2xl font-bold leading-tight'>
                    {title}
                  </h2>
                ) : null}
                {subtitle ? (
                  <p className='mt-1 text-sm text-muted-foreground'>
                    {subtitle}
                  </p>
                ) : null}
              </div>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => setOpen(false)}
                aria-label='Close'
                className='shrink-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
            {toolbar ? (
              <div className='flex justify-center border-b border-border px-4 py-3'>
                {toolbar}
              </div>
            ) : null}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        // overflow-x must stay visible enough for in-content popovers;
        // overflow-y-auto alone still clips x in most browsers, so pad children instead.
        'flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-5',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'sticky bottom-0 flex justify-end border-t border-border bg-muted/50 p-4',
        className,
      )}
    >
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'fixed inset-0 z-50 h-full w-full bg-foreground/50 backdrop-blur-md pointer-events-none',
        className,
      )}
    />
  );
};
