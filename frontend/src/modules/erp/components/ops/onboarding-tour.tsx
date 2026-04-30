'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  SkipForward,
  X,
} from 'lucide-react';
import type { OnboardingTour, TourPosition } from '../../types';

interface OnboardingTourProps {
  tour: OnboardingTour | null;
  onComplete: () => void;
  onSkip: () => void;
}

function getPositionStyles(
  position: TourPosition,
  rect: DOMRect,
  gap: number
): React.CSSProperties {
  switch (position) {
    case 'top':
      return {
        bottom: `${window.innerHeight - rect.top + gap}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
      };
    case 'bottom':
      return {
        top: `${rect.bottom + gap}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
      };
    case 'left':
      return {
        top: `${rect.top + rect.height / 2}px`,
        right: `${window.innerWidth - rect.left + gap}px`,
        transform: 'translateY(-50%)',
      };
    case 'right':
      return {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.right + gap}px`,
        transform: 'translateY(-50%)',
      };
  }
}

export function OnboardingTour({ tour, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState<React.CSSProperties>({});
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = tour?.steps[currentStep];
  const totalSteps = tour?.steps.length || 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  // Find target element and calculate position
  const updatePosition = useCallback(() => {
    if (!tour || !step) return;

    const target = document.getElementById(step.targetId);
    if (!target) return;

    targetRef.current = target;

    // Scroll target into view if needed
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    // Wait for scroll to finish
    setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const styles = getPositionStyles(step.position, rect, 12);
      setPosition(styles);
    }, 300);
  }, [tour, step]);

  useEffect(() => {
    if (!tour) return;
    setCurrentStep(tour.currentStep);
  }, [tour]);

  useEffect(() => {
    if (!tour) return;
    // Small delay to let scroll happen
    const timer = setTimeout(updatePosition, 100);
    return () => clearTimeout(timer);
  }, [currentStep, tour, updatePosition]);

  // Move handler definitions before keyboard useEffect to avoid reference issues
  const handleNext = useCallback(() => {
    if (isLastStep) {
      if (dontShowAgain) {
        try {
          localStorage.setItem('erp-onboarding-done', 'true');
        } catch {}
      }
      onComplete();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  }, [isLastStep, dontShowAgain, onComplete, totalSteps]);

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!tour) return;

    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          handlePrev();
          break;
        case 'Escape':
          onSkip();
          break;
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [tour, currentStep, totalSteps, handleNext, handlePrev, onSkip]);

  if (!tour || !step) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.targetId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Spotlight overlay */}
        <div
          className="fixed inset-0 z-[90] pointer-events-none"
          style={{ backgroundColor: 'var(--app-overlay)' }}
        />

        {/* Target highlight ring */}
        {targetRef.current && (
          <div
            className="fixed z-[95] pointer-events-none rounded-xl border-2"
            style={{
              top: targetRef.current.getBoundingClientRect().top - 6,
              left: targetRef.current.getBoundingClientRect().left - 6,
              width: targetRef.current.getBoundingClientRect().width + 12,
              height: targetRef.current.getBoundingClientRect().height + 12,
              borderColor: 'var(--app-accent)',
              boxShadow: '0 0 0 4px rgba(204, 92, 55, 0.2), 0 0 30px rgba(204, 92, 55, 0.15)',
              transition: 'all 0.3s ease',
            }}
          />
        )}

        {/* Tooltip */}
        <div
          ref={tooltipRef}
          className="fixed z-[100] w-[320px] max-w-[calc(100vw-48px)] pointer-events-auto"
          style={position}
          role="dialog"
          aria-modal="false"
          aria-label={`Tour step ${currentStep + 1} of ${totalSteps}: ${step.title}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-[var(--app-card-bg)] border border-[var(--app-border-strong)] rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)]">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <button
                onClick={onSkip}
                className="flex items-center justify-center w-6 h-6 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)] transition-colors"
                aria-label="Skip tour"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Title */}
            <div className="px-4 pb-2">
              <h3 className="text-sm font-semibold text-[var(--app-text)] leading-snug">
                {step.title}
              </h3>
              <p className="text-xs text-[var(--app-text-secondary)] mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Progress bar */}
            <div className="px-4 pb-3">
              <div className="h-1 rounded-full bg-[var(--app-hover-bg)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="h-full rounded-full bg-[var(--app-accent)]"
                />
              </div>
            </div>

            {/* Don't show again (last step) */}
            {isLastStep && (
              <div className="px-4 pb-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="rounded border-[rgba(255,255,255,0.15)] bg-transparent accent-[var(--app-accent)]"
                  />
                  <span className="text-[11px] text-[var(--app-text-muted)]">
                    Don&apos;t show this tour again
                  </span>
                </label>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--app-border)]">
              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] transition-colors"
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onSkip}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)] transition-colors"
                  aria-label="Skip tour"
                >
                  <SkipForward className="w-3 h-3" />
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--app-accent)] text-white hover:bg-[var(--app-accent)]/90 transition-colors"
                  aria-label={isLastStep ? 'Get Started - complete tour' : 'Next step'}
                >
                  {isLastStep ? 'Get Started' : 'Next'}
                  {!isLastStep && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
