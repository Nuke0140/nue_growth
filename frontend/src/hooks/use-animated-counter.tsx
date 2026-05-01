'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

interface AnimatedCounterOptions {
  duration?: number;
  startValue?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  easing?: (t: number) => number;
}

export function useAnimatedCounter(
  endValue: number,
  options: AnimatedCounterOptions = {}
) {
  const {
    duration = 2000,
    startValue = 0,
    decimalPlaces = 0,
    prefix = '',
    suffix = '',
    easing = (t: number) => 1 - Math.pow(1 - t, 3) // Cubic ease-out
  } = options;

  const [currentValue, setCurrentValue] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | undefined>();
  const startTimeRef = useRef<number | undefined>();
  const prevEndValueRef = useRef<number | undefined>();

  // Use useMemo to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => ({
    duration,
    startValue,
    decimalPlaces,
    prefix,
    suffix,
    easing
  }), [duration, startValue, decimalPlaces, prefix, suffix, easing]);

  useEffect(() => {
    // Only restart animation if endValue actually changed
    if (prevEndValueRef.current === endValue) return;
    
    prevEndValueRef.current = endValue;
    setIsAnimating(true);
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return;

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / memoizedOptions.duration, 1);
      const easedProgress = memoizedOptions.easing(progress);
      
      const newValue = memoizedOptions.startValue + (endValue - memoizedOptions.startValue) * easedProgress;
      const roundedValue = memoizedOptions.decimalPlaces > 0 
        ? parseFloat(newValue.toFixed(memoizedOptions.decimalPlaces))
        : Math.round(newValue);

      setCurrentValue(roundedValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [endValue, memoizedOptions]);

  const formattedValue = useMemo(() => 
    `${memoizedOptions.prefix}${currentValue.toLocaleString()}${memoizedOptions.suffix}`,
    [currentValue, memoizedOptions.prefix, memoizedOptions.suffix]
  );

  return {
    value: currentValue,
    formattedValue,
    isAnimating
  };
}
