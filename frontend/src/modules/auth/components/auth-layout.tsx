'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const leftPanelVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

const rightPanelVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function AuthLayout({ leftPanel, rightPanel }: AuthLayoutProps) {
  return (
    <motion.div
      className="flex min-h-screen w-full flex-col lg:flex-row"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left Panel - hidden on mobile, 40% on desktop */}
      <motion.div
        className="relative hidden lg:flex lg:w-[40%] flex-col items-center justify-center overflow-hidden"
        variants={leftPanelVariants}
      >
        {leftPanel}
      </motion.div>

      {/* Right Panel - full screen on mobile, 60% on desktop */}
      <motion.div
        className="flex w-full flex-col items-center justify-center bg-white lg:w-[60%]"
        variants={rightPanelVariants}
      >
        {rightPanel}
      </motion.div>
    </motion.div>
  );
}
