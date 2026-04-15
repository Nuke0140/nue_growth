'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: boolean;
  onResend?: () => void;
  resendCooldown?: number;
  onEditNumber?: () => void;
  value?: string;
  onChange?: (val: string) => void;
}

export default function OtpInput({
  length = 6,
  onComplete,
  error = false,
  onResend,
  resendCooldown = 30,
  onEditNumber,
  value,
  onChange,
}: OtpInputProps) {
  const [otpValues, setOtpValues] = useState<string[]>(
    value ? value.padEnd(length, '').slice(0, length).split('') : Array(length).fill('')
  );
  const [isComplete, setIsComplete] = useState(false);
  const [cooldown, setCooldown] = useState(resendCooldown);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevValueRef = useRef(value);

  // Derive cooldown active state
  const isCooldownActive = cooldown > 0;

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Sync with external value changes
  useEffect(() => {
    if (value !== undefined && value !== prevValueRef.current) {
      prevValueRef.current = value;
      const padded = value.padEnd(length, '').slice(0, length).split('');
      // Use setTimeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setOtpValues(padded);
        setIsComplete(padded.every((v) => v !== ''));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [value, length]);

  const focusInput = useCallback((index: number) => {
    const el = inputRefs.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  }, []);

  const handleChange = useCallback(
    (index: number, val: string) => {
      // Only accept single digit
      const digit = val.replace(/\D/g, '').slice(-1);

      const newOtpValues = [...otpValues];
      newOtpValues[index] = digit;
      setOtpValues(newOtpValues);

      // Call external onChange
      if (onChange) {
        onChange(newOtpValues.join(''));
      }

      // Auto-focus next input
      if (digit && index < length - 1) {
        focusInput(index + 1);
      }

      // Check completion
      const otpString = newOtpValues.join('');
      if (otpString.length === length && !newOtpValues.includes('')) {
        setIsComplete(true);
        onComplete(otpString);
      } else {
        setIsComplete(false);
      }
    },
    [otpValues, length, onComplete, onChange, focusInput]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        // If current field has a value, clear it
        if (otpValues[index] !== '') {
          const newOtpValues = [...otpValues];
          newOtpValues[index] = '';
          setOtpValues(newOtpValues);
          if (onChange) {
            onChange(newOtpValues.join(''));
          }
          setIsComplete(false);
        } else if (index > 0) {
          // If current field is empty, move to previous and clear
          const newOtpValues = [...otpValues];
          newOtpValues[index - 1] = '';
          setOtpValues(newOtpValues);
          if (onChange) {
            onChange(newOtpValues.join(''));
          }
          focusInput(index - 1);
          setIsComplete(false);
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [otpValues, length, onChange, focusInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

      if (pastedData.length === 0) return;

      const newOtpValues = [...otpValues];
      for (let i = 0; i < length; i++) {
        newOtpValues[i] = pastedData[i] || '';
      }
      setOtpValues(newOtpValues);

      if (onChange) {
        onChange(newOtpValues.join(''));
      }

      // Focus the next empty field or the last field
      const nextEmpty = newOtpValues.findIndex((v) => v === '');
      if (nextEmpty !== -1) {
        focusInput(nextEmpty);
      } else {
        focusInput(length - 1);
      }

      // Check completion
      const otpString = newOtpValues.join('');
      if (otpString.length === length && !newOtpValues.includes('')) {
        setIsComplete(true);
        onComplete(otpString);
      }
    },
    [otpValues, length, onComplete, onChange, focusInput]
  );

  const handleFocus = useCallback((index: number) => {
    const el = inputRefs.current[index];
    if (el) {
      el.select();
    }
  }, []);

  const handleResend = () => {
    if (isCooldownActive) return;
    setCooldown(resendCooldown);
    if (onResend) {
      onResend();
    }
  };

  // Shake animation for error
  const shakeAnimation = error
    ? {
        animate: { x: [0, -5, 5, -5, 5, 0] },
        transition: { duration: 0.4 },
      }
    : {};

  return (
    <div className="w-full space-y-5" ref={containerRef}>
      {/* OTP Input Boxes */}
      <motion.div
        className="flex items-center justify-center gap-2 sm:gap-3"
        {...shakeAnimation}
      >
        {otpValues.map((digit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 20,
              delay: index * 0.05,
            }}
          >
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              onFocus={() => handleFocus(index)}
              aria-label={`OTP digit ${index + 1} of ${length}`}
              className={`w-12 h-14 rounded-xl border-2 text-center text-xl font-bold outline-none transition-all duration-200
                ${
                  error
                    ? 'border-red-500 bg-red-50/50 text-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                    : isComplete
                      ? 'border-green-500 bg-green-50/50 text-green-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/10'
                      : digit
                        ? 'border-gray-900 bg-gray-50 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10'
                        : 'border-gray-200 bg-gray-50/50 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10'
                }
              `}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Success checkmark animation */}
      <AnimatePresence>
        {isComplete && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-green-600"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 10,
                delay: 0.1,
              }}
            >
              <Check className="h-4 w-4" />
            </motion.div>
            OTP Verified
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-center text-sm font-medium text-red-500"
          >
            Invalid OTP. Please try again.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Actions row: Resend + Edit number */}
      <div className="flex items-center justify-center gap-4 text-sm">
        {onEditNumber && (
          <button
            type="button"
            onClick={onEditNumber}
            className="flex items-center gap-1 font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Edit number
          </button>
        )}

        {onResend && (
          <button
            type="button"
            onClick={handleResend}
            disabled={isCooldownActive}
            className={`font-medium transition-colors ${
              isCooldownActive
                ? 'cursor-not-allowed text-gray-300'
                : 'text-gray-900 hover:text-gray-700'
            }`}
          >
            {isCooldownActive ? (
              <span>Resend in {cooldown}s</span>
            ) : (
              <span>Resend OTP</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
