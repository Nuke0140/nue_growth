'use client';
import React, { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Failed to load data',
  message = 'An error occurred while fetching data. Please try again.',
  onRetry,
  retryLabel = 'Retry'
}: ErrorStateProps) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    if (onRetry) {
      await onRetry();
    }
    setTimeout(() => setRetrying(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-app-4xl px-6"
    >
      <div className="w-12 h-12 rounded-[var(--app-radius-lg)] bg-red-500/10 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
      </div>
      <h3 className="text-sm font-semibold text-[var(--app-text)] mb-1">{title}</h3>
      <p className="text-xs text-[var(--app-text-muted)] text-center mb-4 max-w-xs">{message}</p>
      {onRetry && (
        <button onClick={handleRetry} disabled={retrying} className="app-btn-ghost flex items-center gap-2 text-xs">
          <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Retrying...' : retryLabel}
        </button>
      )}
    </motion.div>
  );
}
