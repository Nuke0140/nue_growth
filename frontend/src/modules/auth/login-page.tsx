'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import LoginForm from '@/modules/auth/components/login-form';
import { useAuthStore } from '@/store/auth-store';

export default function LoginPage() {
  const { login, navigateTo } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const handleLogin = () => {
    login('user@diginue.com', 'password');
  };

  const handleForgotPassword = () => {
    navigateTo('forgot-password');
  };

  const handleRegister = () => {
    navigateTo('register');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0a0a0a] dark:via-[#111] dark:to-[#0a0a0a] px-4 py-8">
      {/* Theme Toggle - top right corner */}
      <button
        type="button"
        onClick={toggleTheme}
        className="fixed right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-white/5"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl dark:bg-blue-900/10" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-orange-100/40 blur-3xl dark:bg-orange-900/10" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <Image
            src="/diginue-logo.png"
            alt="DigiNue"
            width={160}
            height={50}
            priority
            className="object-contain"
          />
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.15 }}
          className="rounded-2xl border border-gray-200/80 bg-white p-8 shadow-lg shadow-gray-200/50 dark:border-white/[0.08] dark:bg-[#141414] dark:shadow-none"
        >
          <LoginForm
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
            onRegister={handleRegister}
          />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; 2025 DigiNue. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
