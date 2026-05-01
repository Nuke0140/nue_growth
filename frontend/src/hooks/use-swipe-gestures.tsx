'use client';

import { useState, useRef, useCallback } from 'react';

interface SwipeGestureOptions {
  threshold?: number;
  restraint?: number;
  allowedTime?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipeGestures(options: SwipeGestureOptions = {}) {
  const {
    threshold = 50,
    restraint = 100,
    allowedTime = 300,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  } = options;

  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    const distX = touch.clientX - touchStartRef.current.x;
    const distY = touch.clientY - touchStartRef.current.y;
    
    // Prevent vertical scrolling when swiping horizontally
    if (Math.abs(distX) > Math.abs(distY)) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const elapsedTime = Date.now() - touchStartRef.current.time;
    
    if (elapsedTime <= allowedTime) {
      const distX = touch.clientX - touchStartRef.current.x;
      const distY = touch.clientY - touchStartRef.current.y;
      const absDistX = Math.abs(distX);
      const absDistY = Math.abs(distY);

      if (absDistX >= threshold && absDistY <= restraint) {
        // Horizontal swipe
        if (distX > 0) {
          setSwipeDirection('right');
          onSwipeRight?.();
        } else {
          setSwipeDirection('left');
          onSwipeLeft?.();
        }
      } else if (absDistY >= threshold && absDistX <= restraint) {
        // Vertical swipe
        if (distY > 0) {
          setSwipeDirection('down');
          onSwipeDown?.();
        } else {
          setSwipeDirection('up');
          onSwipeUp?.();
        }
      }
    }

    touchStartRef.current = null;
    
    // Reset swipe direction after animation
    setTimeout(() => setSwipeDirection(null), 300);
  }, [threshold, restraint, allowedTime, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    elementRef,
    swipeDirection,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
}
