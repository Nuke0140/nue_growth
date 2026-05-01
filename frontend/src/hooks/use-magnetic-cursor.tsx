'use client';

import { useState, useEffect, useRef } from 'react';

interface MagneticCursorOptions {
  strength?: number;
  ease?: number;
  scale?: number;
}

export function useMagneticCursor(options: MagneticCursorOptions = {}) {
  const {
    strength = 0.3,
    ease = 0.2,
    scale = 1.05
  } = options;

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      setMousePosition({ x: deltaX, y: deltaY });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovering, strength]);

  const transform = {
    x: mousePosition.x,
    y: mousePosition.y,
    scale: isHovering ? scale : 1,
    transition: `transform ${ease}s ease-out`
  };

  return {
    elementRef,
    transform,
    isHovering
  };
}
