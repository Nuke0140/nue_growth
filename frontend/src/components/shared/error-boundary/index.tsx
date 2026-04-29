'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '../error-state';

// ── Types ──────────────────────────────────────────────

export interface ErrorBoundaryProps {
  /** Content rendered when no error has occurred */
  children: ReactNode;
  /** Optional custom fallback — rendered in place of the default ErrorState */
  fallback?: ReactNode;
  /** Fired when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * When this value changes, the internal error state is cleared so the
   * boundary re-renders its children. Useful for programmatic resets.
   */
  resetKey?: unknown;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ── ErrorBoundary Class Component ──────────────────────

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // ── Static lifecycle ─────────────────────────────────

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // ── Instance lifecycle ───────────────────────────────

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  // React won't call componentDidUpdate when only resetKey changes
  // if state is already clean, so we use getSnapshotBeforeUpdate instead.
  private prevResetKey: unknown = this.props.resetKey;

  componentDidUpdate(): void {
    if (this.props.resetKey !== this.prevResetKey) {
      this.prevResetKey = this.props.resetKey;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hasError: false, error: null });
    }
  }

  // ── Handlers ─────────────────────────────────────────

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  // ── Render ───────────────────────────────────────────

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback takes priority
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <ErrorState
            title="Something went wrong"
            message={
              this.state.error?.message
                ? `An unexpected error occurred: ${this.state.error.message}`
                : 'An unexpected error occurred.'
            }
            onRetry={this.handleReset}
            retryLabel="Try Again"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

// ── withErrorBoundary HOC ──────────────────────────────

type P = Record<string, unknown>;

/**
 * Higher-order component that wraps a component with ErrorBoundary.
 *
 * @example
 * ```tsx
 * const MyPageWithErrorBoundary = withErrorBoundary(MyPage, {
 *   onError: (err) => console.error(err),
 * });
 * ```
 */
export function withErrorBoundary<P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>,
  boundaryProps?: Omit<ErrorBoundaryProps, 'children'>,
): React.ComponentType<P> {
  function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...boundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  WithErrorBoundary.displayName = `withErrorBoundary(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'
  })`;

  return WithErrorBoundary;
}
