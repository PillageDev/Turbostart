'use client';

import type * as React from 'react';

import { type Transition, motion } from 'motion/react';
import { Progress as ProgressPrimitive } from 'radix-ui';

import { cn } from '../lib/utils';

const MotionProgressIndicator = motion.create(ProgressPrimitive.Indicator);

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  transition?: Transition;
};

function Progress({
  className,
  value,
  transition = { type: 'spring', stiffness: 100, damping: 30 },
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'bg-secondary relative h-2 w-full overflow-hidden rounded-full',
        className,
      )}
      value={value}
      {...props}
    >
      <MotionProgressIndicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 rounded-full"
        animate={{ x: `-${100 - (value || 0)}%` }}
        transition={transition}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress, type ProgressProps };
