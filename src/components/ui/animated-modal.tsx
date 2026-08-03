'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react';

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
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) => {
  const { open } = useModal();
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
  const { setOpen } = useModal();
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
        <div className='fixed inset-0 h-full w-full flex items-center justify-center z-50'>
          <Overlay />

          <motion.div
            ref={modalRef}
            className={cn(
              'min-h-[50%] max-h-[90%] md:max-w-[40%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl relative z-50 flex flex-col flex-1 pointer-events-auto',
              className
            )}
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelExit}
            transition={panelTransition}
          >
            <div className='flex justify-between items-center p-4'>
              <h2 className='text-2xl font-bold'>{title}</h2>
              <CloseIcon />
            </div>
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
        'flex flex-col p-4 overflow-y-auto overflow-x-hidden',
        className
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
        'flex justify-end p-4 bg-gray-100 dark:bg-neutral-900 sticky bottom-0',
        className
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
        'fixed inset-0 h-full w-full bg-black/50 backdrop-blur-md z-50 pointer-events-none',
        className
      )}
    />
  );
};

const CloseIcon = () => {
  const { setOpen } = useModal();
  return (
    <button
      onClick={() => setOpen(false)}
      className='absolute top-4 right-4 group'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='text-black dark:text-white h-4 w-4 transition-transform duration-200 ease-out fine-hover:scale-110 fine-hover:rotate-3'
      >
        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
        <path d='M18 6l-12 12' />
        <path d='M6 6l12 12' />
      </svg>
    </button>
  );
};

// Hook to detect clicks outside of a component.
// Add it in a separate file, I've added here for simplicity
export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // DO NOTHING if the element being clicked is the target element or their children
      const target = event.target as Node | null;
      if (!ref.current || !target || ref.current.contains(target)) {
        return;
      }
      callback(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, callback]);
};
