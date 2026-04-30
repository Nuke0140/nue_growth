'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Bot,
  TrendingUp,
  Shield,
  Lock,
  Clock,
  Quote,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Unified Business Intelligence',
    description: 'Consolidate all your business data into one actionable dashboard.',
  },
  {
    icon: Bot,
    title: 'AI-Powered Automation',
    description: 'Automate repetitive workflows with intelligent AI agents.',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Make data-driven decisions with live performance metrics.',
  },
  {
    icon: Shield,
    title: 'Enterprise Grade Security',
    description: 'Bank-level encryption and compliance built into every layer.',
  },
];

const trustBadges = [
  { icon: Shield, label: 'SOC 2 Compliant' },
  { icon: Lock, label: '256-bit Encryption' },
  { icon: Clock, label: '99.9% Uptime' },
];

const floatingShapes = [
  { size: 120, top: '8%', left: '10%', delay: 0, duration: 7 },
  { size: 80, top: '15%', right: '12%', delay: 1.5, duration: 9 },
  { size: 60, bottom: '20%', left: '5%', delay: 3, duration: 8 },
  { size: 100, bottom: '10%', right: '8%', delay: 0.5, duration: 10 },
  { size: 40, top: '45%', left: '70%', delay: 2, duration: 6 },
  { size: 50, top: '65%', left: '15%', delay: 4, duration: 11 },
];

const featureListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
    },
  },
};

export default function AuthSideBranding() {
  return (
    <div className="relative flex h-full w-full min-h-screen flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 p-8 lg:p-12">
      {/* Animated floating shapes */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/[0.07]"
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            right: shape.right,
            bottom: shape.bottom,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        />
      ))}

      {/* Logo & Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
        className="relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="mb-4 inline-block rounded-xl bg-white/10 backdrop-blur-sm p-2"
        >
          <Image
            src="/logo.png"
            alt="DigiNue Logo"
            width={120}
            height={80}
            priority
            className="object-contain"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-2xl font-bold text-white lg:text-3xl"
        >
          AI Growth Operating System
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-2 text-sm text-white/70 lg:text-base"
        >
          Streamline operations, amplify growth, and unlock the full potential of your business.
        </motion.p>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        className="relative z-10 space-y-4"
        variants={featureListVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={featureItemVariants}
            className="flex items-start gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <feature.icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
              <p className="mt-0.5 text-xs text-white/65 leading-relaxed">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom section: Trust badges + Testimonial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.6 }}
        className="relative z-10 space-y-5"
      >
        {/* Trust Badges */}
        <div className="flex flex-wrap gap-3">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 200 }}
              className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
            >
              <badge.icon className="h-3 w-3" />
              {badge.label}
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
        >
          <Quote className="mb-2 h-5 w-5 text-white/40" />
          <p className="text-sm italic text-white/85 leading-relaxed">
            &ldquo;DigiNue transformed how we manage our entire business operations.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
              RS
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Rahul Sharma</p>
              <p className="text-[11px] text-white/60">CEO at TechVentures</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
