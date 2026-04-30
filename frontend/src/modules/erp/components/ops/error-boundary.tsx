'use client';
import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useErpStore } from '../../erp-store';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErpErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    useErpStore.getState().navigateTo('ops-dashboard');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md px-6"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--app-text)] mb-2">Something went wrong</h3>
            <p className="text-sm text-[var(--app-text-secondary)] mb-1">An unexpected error occurred.</p>
            {this.state.error && (
              <p className="text-xs text-[var(--app-text-muted)] mb-6 font-mono bg-[var(--app-hover-bg)] p-3 rounded-lg break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex items-center justify-center gap-3">
              <button onClick={this.handleReset} className="app-btn-ghost flex items-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
              <button onClick={this.handleGoHome} className="app-btn-primary flex items-center gap-2 text-sm">
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      );
    }
    return this.props.children;
  }
}
