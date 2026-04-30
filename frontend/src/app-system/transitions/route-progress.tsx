'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValueEvent } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spring = useSpring(0, {
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  });

  const isVisible = useSpring(0, {
    stiffness: 500,
    damping: 30,
  });

  // Reset spring when it reaches 0 (for hiding after complete)
  useMotionValueEvent(spring, 'change', (latest) => {
    if (latest < 0.01 && spring.get() < 0.01) {
      spring.set(0);
    }
  });

  useEffect(() => {
    // Clear any previous timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Start progress - animate bar and show it
    spring.set(0.8);
    isVisible.set(1);

    // Wait for the route change to settle before finishing
    const finishTimer = setTimeout(() => {
      spring.set(1);

      timerRef.current = setTimeout(() => {
        // Hide the bar after completing
        isVisible.set(0);

        // Reset spring after hide animation
        timerRef.current = setTimeout(() => {
          spring.set(0);
        }, 300);
      }, 300);
    }, 200);

    return () => {
      clearTimeout(finishTimer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pathname, searchParams, spring, isVisible]);

  return (
    <motion.div
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-0.5 origin-left'
      )}
      style={{
        scaleX: spring,
        opacity: isVisible,
        background:
          'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 50%, hsl(var(--primary)) 100%)',
      }}
      aria-hidden="true"
    />
  );
}

export default RouteProgress;
