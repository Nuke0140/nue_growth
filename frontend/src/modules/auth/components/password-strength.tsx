'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  met: boolean;
}

const strengthConfig = [
  { level: 'Weak', color: 'text-red-600', barColor: 'bg-red-500', progressColor: '[&>div]:bg-red-500', score: 1 },
  { level: 'Fair', color: 'text-orange-500', barColor: 'bg-orange-500', progressColor: '[&>div]:bg-orange-500', score: 2 },
  { level: 'Good', color: 'text-yellow-600', barColor: 'bg-yellow-600', progressColor: '[&>div]:bg-yellow-600', score: 3 },
  { level: 'Strong', color: 'text-green-600', barColor: 'bg-green-600', progressColor: '[&>div]:bg-green-600', score: 4 },
];

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = useMemo<Requirement[]>(() => {
    if (!password) {
      return [
        { label: 'At least 8 characters', met: false },
        { label: 'One uppercase letter', met: false },
        { label: 'One lowercase letter', met: false },
        { label: 'One number', met: false },
        { label: 'One special character', met: false },
      ];
    }

    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'One lowercase letter', met: /[a-z]/.test(password) },
      { label: 'One number', met: /\d/.test(password) },
      { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const strengthScore = useMemo(() => {
    return requirements.filter((r) => r.met).length;
  }, [requirements]);

  const strength = useMemo(() => {
    if (!password) return strengthConfig[0];
    if (strengthScore <= 1) return strengthConfig[0];
    if (strengthScore === 2) return strengthConfig[1];
    if (strengthScore === 3) return strengthConfig[2];
    return strengthConfig[3];
  }, [password, strengthScore]);

  const progressValue = password ? (strengthScore / 5) * 100 : 0;

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-3 overflow-hidden"
    >
      {/* Strength Label + Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Password strength</span>
          <motion.span
            key={strength.level}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-xs font-semibold ${strength.color}`}
          >
            {strength.level}
          </motion.span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={strengthScore}
              initial={{ width: 0 }}
              animate={{ width: `${progressValue}%` }}
              exit={{ width: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className={`absolute inset-y-0 left-0 rounded-full ${strength.barColor}`}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        <AnimatePresence>
          {requirements.map((req, index) => (
            <motion.div
              key={req.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 18,
                delay: index * 0.03,
              }}
              className="flex items-center gap-2"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: req.met ? [1, 1.2, 1] : 1,
                  backgroundColor: req.met ? '#16a34a' : '#e5e7eb',
                }}
                transition={{ duration: 0.25 }}
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                  req.met ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                {req.met ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <Check className="h-2.5 w-2.5 text-white" />
                  </motion.span>
                ) : (
                  <X className="h-2.5 w-2.5 text-gray-400" />
                )}
              </motion.div>
              <span
                className={`text-xs transition-colors ${
                  req.met ? 'font-medium text-green-600' : 'text-gray-400'
                }`}
              >
                {req.label}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
