'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, EyeOff, ArrowRight, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { login, navigateTo } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !companyCode || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Demo login API simulation until backend is done
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email && password && companyCode) {
            resolve({ success: true, token: 'demo-jwt-token-123' });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1500);
      });

      try {
        // Try to authenticate with the actual backend
        await login(email, password);
      } catch (backendErr) {
        console.warn('Backend login failed. Proceeding with demo mode.', backendErr);
      }

      // Always apply demo mode state because backend isn't ready
      document.cookie = "token=demo-jwt-token-123; path=/; max-age=3600";
      document.cookie = "auth-token=demo-jwt-token-123; path=/; max-age=3600";

      // Force Zustand state update instantly to swap the UI to the dashboard
      useAuthStore.setState({
        isAuthenticated: true,
        currentPage: 'login',
        activeModule: null,
        user: {
          id: 'usr-demo-001',
          name: email.split('@')[0] || 'Demo User',
          email: email,
          role: 'admin',
          status: 'active',
          timezone: 'Asia/Kolkata',
          language: 'English',
          avatar: `https://ui-avatars.com/api/?name=${email.charAt(0) || 'U'}&background=6366f1&color=fff`,
        } as any
      });

      toast({
        title: 'Success!',
        description: 'You have successfully logged in.',
      });
      
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigateTo('forgot-password');
  };

  const handleRegister = () => {
    navigateTo('register');
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#050505] px-4 py-8 overflow-hidden font-sans selection:bg-blue-500/30 text-gray-900 dark:text-zinc-100">
      
      {/* Theme Toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      )}

      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] flex flex-col items-center"
      >
        {/* Top Section / Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="Logo" width={120} height={80} priority className="object-contain mb-4" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">NueEra</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Run Your Entire Business From One System
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full rounded-[24px] border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-8 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-zinc-400">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              {/* Work Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                  Work Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border-gray-200 dark:border-white/[0.1] bg-gray-50/50 dark:bg-white/[0.03] px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {/* Company Code */}
              <div className="space-y-2">
                <Label htmlFor="companyCode" className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                  Company Code
                </Label>
                <Input
                  id="companyCode"
                  type="text"
                  placeholder="e.g. ACME"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  className="h-11 rounded-xl border-gray-200 dark:border-white/[0.1] bg-gray-50/50 dark:bg-white/[0.03] px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl border-gray-200 dark:border-white/[0.1] bg-gray-50/50 dark:bg-white/[0.03] px-4 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isLoading}
              className="group relative h-11 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-orange-500 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] disabled:opacity-70 disabled:hover:scale-100"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleRegister}
                className="font-medium text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Create account
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} NueEra Growth OS. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
}
