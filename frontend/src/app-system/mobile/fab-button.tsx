'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface FabButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
}

export function FabButton({ isOpen, onToggle, icon }: FabButtonProps) {
  const showCustomIcon = icon !== undefined;

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'w-14 h-14 rounded-full',
        'flex items-center justify-center',
        'shadow-lg',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'cursor-pointer',
        'md:hidden',
        buttonVariants({ variant: 'default', size: 'icon' })
      )}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      animate={{
        rotate: isOpen && !showCustomIcon ? 45 : 0,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      {showCustomIcon ? (
        <motion.span
          animate={{
            scale: isOpen ? 0 : 1,
            opacity: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
          className="absolute flex items-center justify-center"
        >
          {icon}
        </motion.span>
      ) : null}

      {!showCustomIcon ? (
        isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )
      ) : (
        <motion.span
          animate={{
            scale: isOpen ? 1 : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center"
        >
          <X className="h-6 w-6" />
        </motion.span>
      )}
    </motion.button>
  );
}

export default FabButton;
