'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronRight,
  Zap,
  Moon,
  Sun,
} from 'lucide-react';

export default function AuthPage() {
  const { login, signup, isAuthView, toggleAuthView } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isAuthView) {
        await login(email, password);
      } else {
        await signup({ full_name: name, email, password });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-[#f5f5f5]'}`}>
      {/* Animated gradient orbs - black/white only */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl ${isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'}`}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'}`}
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -60, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className={`absolute inset-0 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.04]'}`}
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/15'}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Theme toggle - top right */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={`absolute top-6 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-white/[0.06] border-white/10 text-white/60 hover:text-white' : 'bg-black/[0.06] border-black/10 text-black/60 hover:text-black'}`}
      >
        {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
      </motion.button>

      {/* Main auth card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Glass card */}
        <div className={`relative rounded-3xl border backdrop-blur-2xl shadow-2xl p-8 md:p-10 transition-colors duration-500 ${isDark ? 'bg-white/[0.04] border-white/[0.08] shadow-black/40' : 'bg-white/70 border-black/[0.08] shadow-black/10'}`}>
          {/* Top accent line */}
          <div className={`absolute top-0 left-8 right-8 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-white/30 to-transparent' : 'bg-gradient-to-r from-transparent via-black/20 to-transparent'}`} />

          {/* Logo area */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="relative mb-4">
              <motion.div
                className="overflow-hidden rounded-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Image
                  src="/logo.png"
                  alt="DigiNue Logo"
                  width={140}
                  height={93}
                  priority
                  className="object-contain"
                />
              </motion.div>
              <motion.div
                className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 ${isDark ? 'bg-white border-[#050505]' : 'bg-black border-[#f5f5f5]'}`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>
              DigiNue
            </h1>
            <p className={`text-sm mt-1.5 tracking-wide transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              Enterprise Business Suite
            </p>
          </motion.div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isAuthView ? 'login' : 'signup'}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: isAuthView ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isAuthView ? -30 : 30 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Name field (signup only) */}
              <AnimatePresence>
                {!isAuthView && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="relative group">
                      <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors ${isDark ? 'text-white/30 group-focus-within:text-white/70' : 'text-black/30 group-focus-within:text-black/70'}`} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm focus:outline-none transition-all duration-300 ${isDark
                          ? 'bg-white/[0.06] border-white/10 text-white placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08] focus:ring-2 focus:ring-white/10'
                          : 'bg-black/[0.04] border-black/10 text-black placeholder:text-black/25 focus:border-black/30 focus:bg-black/[0.06] focus:ring-2 focus:ring-black/10'
                          }`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email field */}
              <div className="relative group">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors ${isDark ? 'text-white/30 group-focus-within:text-white/70' : 'text-black/30 group-focus-within:text-black/70'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm focus:outline-none transition-all duration-300 ${isDark
                    ? 'bg-white/[0.06] border-white/10 text-white placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08] focus:ring-2 focus:ring-white/10'
                    : 'bg-black/[0.04] border-black/10 text-black placeholder:text-black/25 focus:border-black/30 focus:bg-black/[0.06] focus:ring-2 focus:ring-black/10'
                    }`}
                />
              </div>

              {/* Password field */}
              <div className="relative group">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors ${isDark ? 'text-white/30 group-focus-within:text-white/70' : 'text-black/30 group-focus-within:text-black/70'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className={`w-full pl-11 pr-12 py-3.5 rounded-xl border text-sm focus:outline-none transition-all duration-300 ${isDark
                    ? 'bg-white/[0.06] border-white/10 text-white placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08] focus:ring-2 focus:ring-white/10'
                    : 'bg-black/[0.04] border-black/10 text-black placeholder:text-black/25 focus:border-black/30 focus:bg-black/[0.06] focus:ring-2 focus:ring-black/10'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-white/30 hover:text-white/60' : 'text-black/30 hover:text-black/60'}`}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>

              {/* Extra row */}
              {isAuthView && (
                <div className="flex items-center justify-between text-xs">
                  <label className={`flex items-center gap-2 cursor-pointer transition-colors ${isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'}`}>
                    <input
                      type="checkbox"
                      className={`w-3.5 h-3.5 rounded border ${isDark ? 'border-white/20 bg-white/5 accent-white' : 'border-black/20 bg-black/5 accent-black'}`}
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className={`font-medium transition-colors ${isDark ? 'text-white/50 hover:text-white/80' : 'text-black/50 hover:text-black/80'}`}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`relative w-full py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-colors duration-500 overflow-hidden group ${isDark
                  ? 'bg-white text-black shadow-white/10 hover:shadow-white/15'
                  : 'bg-black text-white shadow-black/10 hover:shadow-black/15'
                  }`}
              >
                <motion.div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark ? 'bg-white/80' : 'bg-black/80'}`}
                />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <motion.div
                      className={`w-5 h-5 border-2 rounded-full ${isDark ? 'border-black/30 border-t-black' : 'border-white/30 border-t-white'}`}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <>
                      {isAuthView ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </span>
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
            <span className={`text-xs uppercase tracking-wider ${isDark ? 'text-white/25' : 'text-black/25'}`}>or</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-3 gap-3">
            {['Google', 'GitHub', 'Microsoft'].map((provider) => (
              <motion.button
                key={provider}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`py-2.5 rounded-xl border text-xs font-medium transition-all duration-500 ${isDark
                  ? 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white/80'
                  : 'bg-black/[0.03] border-black/[0.08] text-black/50 hover:bg-black/[0.06] hover:text-black/80'
                  }`}
              >
                {provider}
              </motion.button>
            ))}
          </div>

          {/* Toggle auth view */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDark ? 'text-white/35' : 'text-black/35'}`}>
              {isAuthView ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={toggleAuthView}
                className={`ml-1.5 font-medium transition-colors inline-flex items-center gap-0.5 ${isDark ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'}`}
              >
                {isAuthView ? 'Sign Up' : 'Sign In'}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </p>
          </div>
        </div>

        {/* Bottom branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`flex items-center justify-center gap-1.5 mt-6 text-xs ${isDark ? 'text-white/20' : 'text-black/20'}`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Powered by DigiNue Platform</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
