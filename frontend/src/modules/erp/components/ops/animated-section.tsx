'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION } from '@/styles/design-tokens';

interface AnimatedSectionProps {
  children: React.ReactNode;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Extra className */
  className?: string;
}

function AnimatedSectionInner({ children, delay = 0, className }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={ANIMATION.fadeUp.initial}
      animate={ANIMATION.fadeUp.animate}
      transition={{
        duration: ANIMATION.duration.normal,
        ease: ANIMATION.ease as unknown as number[],
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export const AnimatedSection = memo(AnimatedSectionInner);
