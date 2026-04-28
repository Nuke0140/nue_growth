'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useActivityStore } from '../activity-store';
import type { Notification, ActivityEventType } from '../types';

interface RealtimeState {
  isOnline: boolean;
  lastSync: Date | null;
  pendingUpdates: number;
  liveNotifications: Notification[];
}

interface SimulatedEvent {
  type: ActivityEventType;
  title: string;
  actor: string;
  entityType: 'task' | 'project' | 'employee' | 'leave' | 'approval' | 'payroll' | 'asset' | 'ai';
  entityId: string;
}

export function useRealtime() {
  // Simulate connection status
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [pendingUpdates, setPendingUpdates] = useState(0);
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { track } = useActivityStore();

  // Simulate periodic "live" events every 20 seconds
  useEffect(() => {
    const simulatedEvents: SimulatedEvent[] = [
      { type: 'task_updated', title: 'Vikram Joshi updated task status', actor: 'Vikram Joshi', entityType: 'task', entityId: 't2' },
      { type: 'comment_added', title: 'New comment on NexaBank project', actor: 'Priya Sharma', entityType: 'project', entityId: 'p1' },
      { type: 'task_completed', title: 'Arun Kumar completed a task', actor: 'Arun Kumar', entityType: 'task', entityId: 't4' },
      { type: 'leave_applied', title: 'Pooja Iyer applied for leave', actor: 'Pooja Iyer', entityType: 'leave', entityId: 'l-new' },
      { type: 'approval_requested', title: 'New budget approval request', actor: 'Ananya Das', entityType: 'approval', entityId: 'ap-new' },
    ];

    intervalRef.current = setInterval(() => {
      // Pick a random event
      const event = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      track({
        type: event.type,
        title: event.title,
        description: event.title,
        actor: event.actor,
        entityType: event.entityType,
        entityId: event.entityId,
      });

      // Update sync time
      setLastSync(new Date());
      setPendingUpdates((prev) => prev + 1);

      // Occasionally add a live notification (60% chance)
      if (Math.random() > 0.4) {
        const notif: Notification = {
          id: `rt-${Date.now()}`,
          title: event.title,
          message: `Live update: ${event.title}`,
          type: 'info',
          read: false,
          timestamp: new Date().toISOString(),
        };
        setLiveNotifications((prev) => [notif, ...prev].slice(0, 10));
      }

      // Reset pending count after 5 seconds
      setTimeout(() => {
        setPendingUpdates((prev) => Math.max(0, prev - 1));
      }, 5000);
    }, 20000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [track]);

  // Simulate online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const clearNotifications = useCallback(() => {
    setLiveNotifications([]);
  }, []);

  return {
    isOnline,
    lastSync,
    pendingUpdates,
    liveNotifications,
    clearNotifications,
  };
}
