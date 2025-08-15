'use client';

import type * as React from 'react';

import { type HTMLMotionProps, type Transition, motion } from 'motion/react';

import { cn } from '../lib/utils';
import { Button } from './button';
import { SlidingNumber, type SlidingNumberProps } from './text/sliding-number';

type CounterProps = HTMLMotionProps<'div'> & {
  number: number;
  setNumber: (number: number) => void;
  slidingNumberProps?: Omit<SlidingNumberProps, 'number'>;
  buttonProps?: Omit<React.ComponentProps<typeof Button>, 'onClick'>;
  transition?: Transition;
};

function Counter({
  number,
  setNumber,
  className,
  slidingNumberProps,
  buttonProps,
  transition = { type: 'spring', bounce: 0, stiffness: 300, damping: 30 },
  ...props
}: CounterProps) {
  return (
    <motion.div
      data-slot="counter"
      layout
      transition={transition}
      className={cn(
        'flex items-center gap-x-2 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800',
        className,
      )}
      {...props}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          {...buttonProps}
          onClick={() => setNumber(number - 1)}
          className={cn(
            'bg-white pb-[3px] text-2xl font-light text-neutral-950 hover:bg-white/70 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-950/70',
            buttonProps?.className,
          )}
        >
          -
        </Button>
      </motion.div>

      <SlidingNumber
        number={number}
        {...slidingNumberProps}
        className={cn('text-lg', slidingNumberProps?.className)}
      />

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          {...buttonProps}
          onClick={() => setNumber(number + 1)}
          className={cn(
            'bg-white pb-[3px] text-2xl font-light text-neutral-950 hover:bg-white/70 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-950/70',
            buttonProps?.className,
          )}
        >
          +
        </Button>
      </motion.div>
    </motion.div>
  );
}

export { Counter, type CounterProps };
