'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Loader2,
  Check,
  ArrowRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AuthLayout from '@/modules/auth/components/auth-layout';
import AuthSideBranding from '@/modules/auth/components/auth-side-branding';
import { useAuthStore } from '@/store/auth-store';

const countryCodes = [
  { value: '+91', label: '+91', country: 'India' },
  { value: '+1', label: '+1', country: 'US' },
  { value: '+44', label: '+44', country: 'UK' },
  { value: '+971', label: '+971', country: 'UAE' },
  { value: '+61', label: '+61', country: 'Australia' },
  { value: '+65', label: '+65', country: 'Singapore' },
];

const formVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
    },
  },
};

export default function ForgotPasswordPage() {
  const { navigateTo, setPendingOtpNumber } = useAuthStore();

  // Email reset state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Mobile reset state
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);

  const validateEmail = useCallback((): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  }, [email]);

  const validatePhone = useCallback((): boolean => {
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (!/^\d{7,15}$/.test(phone.replace(/\s/g, ''))) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  }, [phone]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setEmailLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setEmailLoading(false);
    setEmailSuccess(true);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) return;
    setPhoneLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPhoneLoading(false);
    const fullNumber = `${countryCode} ${phone}`;
    setPendingOtpNumber(fullNumber);
    navigateTo('otp');
  };

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/[^\d\s]/g, '');
    setPhone(cleaned);
    if (phoneError) setPhoneError('');
  };

  const rightPanel = (
    <div className="flex w-full flex-col items-center justify-center min-h-screen px-4 py-app-3xl sm:py-app-4xl">
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
        <motion.button
          type="button"
          onClick={() => navigateTo('login')}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-app-2xl flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </motion.button>

        <Card className="rounded-[var(--app-radius-xl)] border-gray-200/60 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]">
          <CardContent className="p-6 md:p-app-3xl">
            {/* Header */}
            <div className="mb-app-2xl text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--app-radius-xl)] bg-gray-100"
              >
                <Mail className="h-6 w-6 text-gray-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900">Forgot your password?</h2>
              <p className="mt-1.5 text-sm text-gray-500">
                No worries, we&apos;ll send you reset instructions.
              </p>
            </div>

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="mb-app-2xl grid w-full grid-cols-2 rounded-[var(--app-radius-lg)] bg-gray-100 p-1">
                <TabsTrigger
                  value="email"
                  className="rounded-[var(--app-radius-lg)] text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] data-[state=active]:text-gray-900"
                >
                  <Mail className="mr-1.5 h-3.5 w-3.5" />
                  Reset via Email
                </TabsTrigger>
                <TabsTrigger
                  value="mobile"
                  className="rounded-[var(--app-radius-lg)] text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] data-[state=active]:text-gray-900"
                >
                  <Phone className="mr-1.5 h-3.5 w-3.5" />
                  Reset via Mobile OTP
                </TabsTrigger>
              </TabsList>

              {/* Email Tab */}
              <TabsContent value="email">
                <AnimatePresence mode="wait">
                  {!emailSuccess ? (
                    <motion.form
                      key="email-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                      variants={formVariants}
                      onSubmit={handleEmailSubmit}
                      className="space-y-4"
                    >
                      <motion.div variants={fieldVariants} className="space-y-2">
                        <Label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (emailError) setEmailError('');
                            }}
                            className={`pl-10 h-10  rounded-[var(--app-radius-lg)] border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 ${
                              emailError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                            }`}
                          />
                        </div>
                        <AnimatePresence>
                          {emailError && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="text-xs text-red-500"
                            >
                              {emailError}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div variants={fieldVariants}>
                        <Button
                          type="submit"
                          disabled={emailLoading}
                          className="h-10  w-full rounded-[var(--app-radius-lg)] bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 active:bg-gray-950"
                        >
                          <AnimatePresence mode="wait">
                            {emailLoading ? (
                              <motion.span
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending Reset Link...
                              </motion.span>
                            ) : (
                              <motion.span
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                Send Reset Link
                                <ArrowRight className="h-4 w-4" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="email-success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className="space-y-app-xl text-center py-4"
                    >
                      {/* Animated checkmark */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 15,
                          delay: 0.1,
                        }}
                        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 250,
                            damping: 12,
                            delay: 0.25,
                          }}
                        >
                          <Check className="h-8 w-8 text-green-600" />
                        </motion.div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          We&apos;ve sent a password reset link to
                        </p>
                        <p className="text-sm font-semibold text-gray-900">{email}</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-3 pt-2"
                      >
                        <p className="text-xs text-gray-400">
                          Didn&apos;t receive the email? Check your spam folder or
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEmailSuccess(false);
                            setEmail('');
                          }}
                          className="h-10 rounded-[var(--app-radius-lg)] border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        >
                          Try a different email
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* Mobile OTP Tab */}
              <TabsContent value="mobile">
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  variants={formVariants}
                  onSubmit={handlePhoneSubmit}
                  className="space-y-4"
                >
                  <motion.div variants={fieldVariants} className="space-y-2">
                    <Label htmlFor="reset-phone" className="text-sm font-medium text-gray-700">
                      Mobile Number
                    </Label>
                    <div className="flex gap-2">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="w-[110px] h-10  rounded-[var(--app-radius-lg)] border-gray-200 bg-gray-50/50 text-gray-900 focus:border-gray-400 focus:ring-gray-400/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((cc) => (
                            <SelectItem key={cc.value} value={cc.value}>
                              <span className="flex items-center gap-1.5">
                                <span className="font-medium">{cc.value}</span>
                                <span className="text-xs text-gray-400">{cc.country}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="reset-phone"
                          type="tel"
                          placeholder="9876543210"
                          value={phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className={`pl-10 h-10  rounded-[var(--app-radius-lg)] border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 ${
                            phoneError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                          }`}
                        />
                      </div>
                    </div>
                    <AnimatePresence>
                      {phoneError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-xs text-red-500"
                        >
                          {phoneError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <Button
                      type="submit"
                      disabled={phoneLoading}
                      className="h-10  w-full rounded-[var(--app-radius-lg)] bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 active:bg-gray-950"
                    >
                      <AnimatePresence mode="wait">
                        {phoneLoading ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending OTP...
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            Send OTP
                            <ArrowRight className="h-4 w-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </motion.form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-app-2xl text-center space-y-3"
        >
          <p className="text-sm text-gray-500">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => navigateTo('login')}
              className="font-semibold text-gray-900 transition-colors hover:text-gray-700 hover:underline"
            >
              Sign in
            </button>
          </p>
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
