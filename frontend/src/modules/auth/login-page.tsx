'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { login, navigateTo } = useAuthStore();

  const [email, setEmail] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !companyCode || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      login(email, password);
    }, 1500);
  };

  const handleForgotPassword = () => {
    navigateTo('forgot-password');
  };

  const handleRegister = () => {
    navigateTo('register');
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#050505] px-4 py-8 overflow-hidden font-sans selection:bg-blue-500/30 text-zinc-100">
      
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
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-orange-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-4">
            <div className="absolute inset-[2px] rounded-full bg-[#0a0a0a]" />
            <div className="relative h-5 w-5 rounded-full bg-gradient-to-br from-blue-400 to-orange-400 blur-[2px]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">NueEra</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Run Your Entire Business From One System
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white">Welcome back</h2>
            <p className="mt-1.5 text-sm text-zinc-400">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              {/* Work Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-zinc-300">
                  Work Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border-white/[0.1] bg-white/[0.03] px-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {/* Company Code */}
              <div className="space-y-2">
                <Label htmlFor="companyCode" className="text-xs font-medium text-zinc-300">
                  Company Code
                </Label>
                <Input
                  id="companyCode"
                  type="text"
                  placeholder="e.g. ACME"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  className="h-11 rounded-xl border-white/[0.1] bg-white/[0.03] px-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-zinc-300">
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
                    className="h-11 rounded-xl border-white/[0.1] bg-white/[0.03] px-4 pr-10 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
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
            <p className="text-sm text-zinc-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleRegister}
                className="font-medium text-white hover:text-blue-400 transition-colors"
              >
                Create account
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} NueEra Growth OS. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
}
