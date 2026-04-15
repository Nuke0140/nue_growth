'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Shield,
} from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import AuthLayout from '@/modules/auth/components/auth-layout';
import AuthSideBranding from '@/modules/auth/components/auth-side-branding';
import OtpInput from '@/modules/auth/components/otp-input';
import { useAuthStore } from '@/store/auth-store';

export default function OtpPage() {
  const { navigateTo, login, pendingOtpNumber } = useAuthStore();

  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const displayNumber = pendingOtpNumber || '+91 98765 43210';

  const handleOtpComplete = useCallback(
    async (completedOtp: string) => {
      setOtp(completedOtp);
      setHasError(false);
      setIsVerifying(true);

      // Simulate verification — in production this would call an API
      // For demo purposes, accept "123456" as the correct OTP
      await new Promise((r) => setTimeout(r, 1500));

      if (completedOtp === '123456') {
        setIsVerifying(false);
        setIsVerified(true);
        // Auto redirect after 2 seconds
        setTimeout(() => {
          login('user@diginue.com', 'password');
        }, 2000);
      } else {
        setIsVerifying(false);
        setHasError(true);
      }
    },
    [login]
  );

  const handleResend = useCallback(() => {
    setOtp('');
    setHasError(false);
    setIsVerified(false);
  }, []);

  const handleEditNumber = useCallback(() => {
    navigateTo('forgot-password');
  }, [navigateTo]);

  // Reset error state when user starts typing again
  const handleOtpChange = useCallback((val: string) => {
    setOtp(val);
    if (hasError) setHasError(false);
  }, [hasError]);

  // Verification in progress overlay
  const renderVerifyingState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-gray-900"
        />
        <p className="text-sm font-medium text-gray-600">Verifying...</p>
      </motion.div>
    </motion.div>
  );

  // Success state
  const renderSuccessState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="space-y-6 py-8 text-center"
    >
      {/* Animated checkmark circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 15,
          delay: 0.1,
        }}
        className="relative mx-auto flex h-20 w-20 items-center justify-center"
      >
        {/* Pulse rings */}
        <motion.div
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-green-400"
        />
        <motion.div
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
          className="absolute inset-0 rounded-full bg-green-400"
        />

        {/* Main circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 12,
            delay: 0.15,
          }}
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-600 shadow-lg shadow-green-600/25"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
              delay: 0.35,
            }}
          >
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-2"
      >
        <h3 className="text-2xl font-bold text-gray-900">Verified!</h3>
        <p className="text-sm text-gray-500">Your phone number has been verified successfully.</p>
      </motion.div>

      {/* Redirect notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center justify-center gap-2"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-gray-600"
        />
        <p className="text-xs text-gray-400">Redirecting to dashboard...</p>
      </motion.div>
    </motion.div>
  );

  const rightPanel = (
    <div className="flex w-full flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="w-full max-w-md"
      >
        {/* Logo header - visible on mobile */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.05 }}
          className="flex justify-center mb-4 lg:hidden"
        >
          <Image src="/logo.png" alt="DigiNue" width={120} height={80} priority className="object-contain" />
        </motion.div>

        {/* Back to Login */}
        {!isVerified && (
          <motion.button
            type="button"
            onClick={() => navigateTo('login')}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </motion.button>
        )}

        <Card className="rounded-2xl border-gray-200/60 shadow-sm">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {isVerified ? (
                renderSuccessState()
              ) : (
                <motion.div
                  key="otp-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="mb-8 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100"
                    >
                      <Shield className="h-6 w-6 text-gray-600" />
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold text-gray-900"
                    >
                      Verify your phone number
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mt-1.5 text-sm text-gray-500"
                    >
                      We sent a 6-digit code to{' '}
                      <span className="font-semibold text-gray-700">{displayNumber}</span>
                    </motion.p>
                  </div>

                  {/* OTP Input */}
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <OtpInput
                        length={6}
                        onComplete={handleOtpComplete}
                        error={hasError}
                        onResend={handleResend}
                        resendCooldown={30}
                        onEditNumber={handleEditNumber}
                        value={otp}
                        onChange={handleOtpChange}
                      />
                    </motion.div>

                    {/* Verifying overlay */}
                    <AnimatePresence>
                      {isVerifying && renderVerifyingState()}
                    </AnimatePresence>
                  </div>

                  {/* Hint */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-center text-xs text-gray-400"
                  >
                    For demo purposes, enter <span className="font-semibold text-gray-600">123456</span> to verify
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center space-y-3"
        >
          {!isVerified && (
            <p className="text-sm text-gray-500">
              Want to use a different method?{' '}
              <button
                type="button"
                onClick={() => navigateTo('forgot-password')}
                className="font-semibold text-gray-900 transition-colors hover:text-gray-700 hover:underline"
              >
                Try another way
              </button>
            </p>
          )}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              &copy; 2025 DigiNue. All rights reserved.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <AuthLayout
      leftPanel={<AuthSideBranding />}
      rightPanel={rightPanel}
    />
  );
}
