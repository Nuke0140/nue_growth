'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface RadialMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface RadialMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: RadialMenuItem[];
}

const ITEM_DIAMETER = 56;
const ITEM_GAP = 12;
const ARC_RADIUS = ITEM_DIAMETER + ITEM_GAP;

function getItemPosition(index: number, total: number) {
  // Distribute items in a semi-circle arc above the FAB
  // Angle range: -150deg to -30deg (upper semi-circle, centered at -90deg / top)
  const startAngle = -150;
  const endAngle = -30;
  const step = total > 1 ? (endAngle - startAngle) / (total - 1) : 0;
  const angle = total > 1 ? startAngle + step * index : -90;

  const angleRad = (angle * Math.PI) / 180;
  const x = Math.cos(angleRad) * ARC_RADIUS;
  const y = Math.sin(angleRad) * ARC_RADIUS;

  return { x, y };
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 500,
      damping: 25,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

export function RadialMenu({ isOpen, onClose, items }: RadialMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Radial items container */}
          <div
            className={cn(
              'fixed bottom-24 right-6 z-40',
              'w-14 h-14',
              'md:hidden'
            )}
            aria-label="Quick actions"
            role="menu"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const position = getItemPosition(index, items.length);

                return (
                  <motion.div
                    key={item.label}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{
                      delay: index * 0.05,
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '50%',
                      right: '50%',
                      x: position.x - ITEM_DIAMETER / 2,
                      y: -(position.y + ITEM_DIAMETER / 2),
                      width: ITEM_DIAMETER,
                      height: ITEM_DIAMETER,
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <motion.button
                      type="button"
                      onClick={() => {
                        item.onClick();
                        onClose();
                      }}
                      className={cn(
                        'flex items-center justify-center',
                        'w-12 h-12 rounded-full',
                        'bg-primary text-primary-foreground',
                        'shadow-[var(--app-shadow-md)]-md',
                        'hover:bg-primary/90',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        'cursor-pointer'
                      )}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                      role="menuitem"
                      aria-label={item.label}
                    >
                      {item.icon}
                    </motion.button>

                    <span
                      className={cn(
                        'text-[10px] font-medium text-foreground',
                        'whitespace-nowrap',
                        'select-none',
                        'pointer-events-none'
                      )}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default RadialMenu;
