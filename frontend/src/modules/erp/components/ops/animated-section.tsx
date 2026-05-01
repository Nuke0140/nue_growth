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

function AnimatedSectionInner({ children, className }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export const AnimatedSection = memo(AnimatedSectionInner);
