'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMagneticCursor } from '@/hooks/use-magnetic-cursor';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  magnetic?: boolean;
  ripple?: boolean;
  gradient?: 'blue-orange' | 'purple-pink' | 'green-teal' | 'amber-orange' | 'none';
  children: React.ReactNode;
}

const gradientClasses = {
  'blue-orange': 'bg-gradient-to-r from-blue-500 to-orange-500',
  'purple-pink': 'bg-gradient-to-r from-purple-500 to-pink-500',
  'green-teal': 'bg-gradient-to-r from-green-500 to-teal-500',
  'amber-orange': 'bg-gradient-to-r from-amber-500 to-orange-500',
  'none': ''
};

const shadowClasses = {
  'blue-orange': 'shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]',
  'purple-pink': 'shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]',
  'green-teal': 'shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)]',
  'amber-orange': 'shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]',
  'none': ''
};

export function PremiumButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  magnetic = false,
  ripple = true,
  gradient = 'blue-orange',
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: PremiumButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  // Magnetic cursor effect
  const { elementRef, transform, isHovering } = useMagneticCursor({
    strength: magnetic ? 0.3 : 0,
    ease: 0.3,
    scale: magnetic ? 1.05 : 1
  });

  // Combine refs
  const combinedRef = (node: HTMLButtonElement) => {
    buttonRef.current = node;
    if (typeof elementRef === 'function') {
      elementRef(node);
    } else if (elementRef) {
      elementRef.current = node;
    }
  };

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!ripple || disabled || loading) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      id: rippleIdRef.current++,
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    onClick?.(event);
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs rounded-lg',
    md: 'h-11 px-4 text-sm rounded-xl',
    lg: 'h-12 px-6 text-base rounded-2xl',
    xl: 'h-14 px-8 text-lg rounded-2xl'
  };

  const variantClasses = {
    primary: cn(
      'text-white border-transparent',
      gradient !== 'none' && gradientClasses[gradient],
      gradient !== 'none' && shadowClasses[gradient]
    ),
    secondary: 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700',
    outline: 'text-gray-700 dark:text-gray-300 bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    link: 'text-blue-600 dark:text-blue-400 hover:underline p-0 h-auto bg-transparent border-none rounded-none shadow-none'
  };

  const focusClasses = {
    primary: 'focus:ring-blue-500/50',
    secondary: 'focus:ring-blue-500/50',
    outline: 'focus:ring-gray-500/50',
    ghost: 'focus:ring-gray-500/50',
    link: 'focus:ring-blue-500/30'
  };

  const baseClasses = cn(
    'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100',
    sizeClasses[size],
    variantClasses[variant],
    fullWidth && 'w-full',
    variant !== 'link' && 'hover:scale-[1.02] active:scale-[0.98]',
    focusClasses[variant],
    className
  );

  const iconElement = icon && (
    <motion.div
      initial={{ rotate: 0 }}
      whileHover={{ rotate: iconPosition === 'right' ? 360 : -360 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex-shrink-0"
    >
      {icon}
    </motion.div>
  );

  const renderContent = () => (
    <>
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Loading state */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </motion.div>
      )}

      {/* Normal content */}
      {!loading && (
        <>
          {iconPosition === 'left' && iconElement}
          <span className="truncate">{children}</span>
          {iconPosition === 'right' && iconElement}
          {!icon && variant === 'primary' && (
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-4 h-4 opacity-70" />
            </motion.div>
          )}
        </>
      )}
    </>
  );

  return (
    <motion.button
      ref={combinedRef}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transform: magnetic && isHovering ? `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` : undefined,
      }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
}

// Specialized button components for common use cases
export function PrimaryButton(props: Omit<PremiumButtonProps, 'variant'>) {
  return <PremiumButton variant="primary" {...props} />;
}

export function SecondaryButton(props: Omit<PremiumButtonProps, 'variant'>) {
  return <PremiumButton variant="secondary" {...props} />;
}

export function OutlineButton(props: Omit<PremiumButtonProps, 'variant'>) {
  return <PremiumButton variant="outline" {...props} />;
}

export function GhostButton(props: Omit<PremiumButtonProps, 'variant'>) {
  return <PremiumButton variant="ghost" {...props} />;
}

export function LinkButton(props: Omit<PremiumButtonProps, 'variant' | 'size'>) {
  return <PremiumButton variant="link" size="sm" {...props} />;
}
