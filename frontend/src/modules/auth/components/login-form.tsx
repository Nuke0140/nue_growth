'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface LoginFormProps {
  onLogin: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

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

export default function LoginForm({ onLogin, onForgotPassword, onRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);

  // Caps lock detection
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  }, []);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'CapsLock') {
      setCapsLockOn((prev) => !prev);
    }
  }, []);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    onLogin();
  };

  // Clear field errors on change
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (errors.email) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.email;
        return next;
      });
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (errors.password) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.password;
        return next;
      });
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Header */}
      <motion.div variants={fieldVariants} className="mb-1 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Sign in
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back, enter your credentials to continue
        </p>
      </motion.div>

      {/* Email */}
      <motion.div variants={fieldVariants} className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={`h-11 rounded-xl border-gray-200 bg-gray-50/50 pl-10 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white/20 dark:focus:ring-white/10 ${
              errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
            }`}
          />
        </div>
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-red-500"
            >
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Password */}
      <motion.div variants={fieldVariants} className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            ref={passwordRef}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            className={`h-11 rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-10 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white/20 dark:focus:ring-white/10 ${
              errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-red-500"
            >
              {errors.password}
            </motion.p>
          )}
          {capsLockOn && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1 text-xs text-amber-600"
            >
              <AlertTriangle className="h-3 w-3" />
              Caps Lock is on
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Remember Me & Forgot Password */}
      <motion.div
        variants={fieldVariants}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            className="h-4 w-4 rounded border-gray-300 dark:border-white/20 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white"
          />
          <Label
            htmlFor="remember"
            className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Remember me
          </Label>
        </div>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          Forgot password?
        </button>
      </motion.div>

      {/* Submit */}
      <motion.div variants={fieldVariants}>
        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 active:bg-gray-950 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:active:bg-gray-300"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Register Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-2 text-center"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onRegister}
            className="font-semibold text-gray-900 transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
          >
            Create one
          </button>
        </p>
      </motion.div>
    </motion.form>
  );
}
