'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Upload,
  FileText,
  Image,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  FileSpreadsheet,
  Film,
  Archive,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  uploadedAt?: string;
  version?: number;
}

interface FileUploadZoneProps {
  onUpload: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  compact?: boolean;
}

// ── Helpers ────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return Image;
  if (type === 'application/pdf') return FileText;
  if (
    type.includes('spreadsheet') ||
    type.includes('excel') ||
    type.includes('csv')
  )
    return FileSpreadsheet;
  if (type.startsWith('video/')) return Film;
  if (type.includes('zip') || type.includes('archive') || type.includes('compressed'))
    return Archive;
  return File;
}

function getFileIconColor(type: string): string {
  if (type.startsWith('image/')) return '#a78bfa';
  if (type === 'application/pdf') return '#ef4444';
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv'))
    return '#22c55e';
  if (type.startsWith('video/')) return '#f59e0b';
  return 'var(--app-text-secondary)';
}

function generateId(): string {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Component ──────────────────────────────────────────

export function FileUploadZone({
  onUpload,
  acceptedTypes,
  maxFiles = 10,
  compact = false,
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const animFrameRef = useRef<number>(0);

  const handleUpload = useCallback(
    (rawFiles: FileList | File[]) => {
      const fileArray = Array.from(rawFiles);

      if (maxFiles && files.length + fileArray.length > maxFiles) {
        fileArray.splice(0, fileArray.length - (maxFiles - files.length));
      }

      const newFiles: UploadedFile[] = fileArray.map((f) => ({
        id: generateId(),
        name: f.name,
        size: f.size,
        type: f.type || 'application/octet-stream',
        progress: 0,
        status: 'uploading',
      }));

      setFiles((prev) => [...prev, ...newFiles]);
      onUpload(fileArray);

      // Simulate upload progress
      newFiles.forEach((newFile) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15 + 5;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === newFile.id
                  ? {
                      ...f,
                      progress: 100,
                      status: 'complete',
                      uploadedAt: new Date().toISOString(),
                      version: Math.floor(Math.random() * 5) + 1,
                    }
                  : f
              )
            );
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === newFile.id ? { ...f, progress: Math.min(progress, 99) } : f
              )
            );
          }
        }, 200);
      });
    },
    [files.length, maxFiles, onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const retryFile = (id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: 'uploading', progress: 0 } : f
      )
    );
    // Re-simulate
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  progress: 100,
                  status: 'complete',
                  uploadedAt: new Date().toISOString(),
                }
              : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress: Math.min(progress, 99) } : f
          )
        );
      }
    }, 200);
  };

  const completedCount = files.filter((f) => f.status === 'complete').length;

  return (
    <div className="ops-card p-0 overflow-hidden">
      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative cursor-pointer transition-all duration-200',
          compact ? 'p-6' : 'p-8'
        )}
        style={{
          backgroundColor: isDragOver
            ? 'var(--app-accent-light)'
            : 'transparent',
          border: `2px dashed ${isDragOver ? 'var(--app-accent)' : 'var(--app-border-strong)'}`, 
          borderRadius: 12,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes?.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center gap-3">
          <motion.div
            animate={isDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center justify-center w-12 h-12 rounded-xl"
            style={{
              backgroundColor: isDragOver
                ? 'var(--app-accent-light)'
                : 'var(--app-hover-bg)',
            }}
          >
            <Upload
              className="w-5 h-5"
              style={{
                color: isDragOver ? 'var(--app-accent)' : 'var(--app-text-muted)',
              }}
            />
          </motion.div>

          <div>
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--app-text)' }}
            >
              {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--app-text-muted)' }}
            >
              or click to browse
              {acceptedTypes && (
                <span>
                  {' '}
                  · {acceptedTypes.map((t) => t.replace('.', '').toUpperCase()).join(', ')}
                </span>
              )}
            </p>
          </div>

          {!compact && maxFiles && (
            <p className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
              {files.length} of {maxFiles} files
            </p>
          )}
        </div>
      </div>

      {/* File list (non-compact mode) */}
      {!compact && (
        <AnimatePresence mode="popLayout">
          {files.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div
                className="flex flex-col"
                style={{
                  borderTop: '1px solid var(--app-border)',
                }}
              >
                {files.map((file, idx) => {
                  const FileIcon = getFileIcon(file.type);
                  const iconColor = getFileIconColor(file.type);

                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12, height: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      layout
                      className="flex items-center gap-3 px-5 py-3"
                      style={{
                        borderBottom: '1px solid var(--app-border)',
                      }}
                    >
                      {/* File icon */}
                      <div
                        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                        style={{ backgroundColor: `${iconColor}15` }}
                      >
                        <FileIcon className="w-4 h-4" style={{ color: iconColor }} />
                      </div>

                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className="text-xs font-medium truncate"
                            style={{ color: 'var(--app-text)' }}
                          >
                            {file.name}
                          </p>
                          {file.version && file.status === 'complete' && (
                            <span
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                              style={{
                                backgroundColor: 'var(--app-accent-light)',
                                color: 'var(--app-accent)',
                              }}
                            >
                              v{file.version}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className="text-[10px]"
                            style={{ color: 'var(--app-text-muted)' }}
                          >
                            {formatFileSize(file.size)}
                          </span>

                          {file.status === 'uploading' && (
                            <div className="flex-1 flex items-center gap-2">
                              <div
                                className="flex-1 h-1 rounded-full overflow-hidden"
                                style={{ backgroundColor: 'var(--app-hover-bg)' }}
                              >
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: 'var(--app-accent)' }}
                                  animate={{ width: `${file.progress}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <span
                                className="text-[10px] shrink-0"
                                style={{ color: 'var(--app-text-muted)' }}
                              >
                                {Math.round(file.progress)}%
                              </span>
                            </div>
                          )}

                          {file.uploadedAt && (
                            <span
                              className="text-[10px]"
                              style={{ color: 'var(--app-text-muted)' }}
                            >
                              {new Date(file.uploadedAt).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="shrink-0">
                        {file.status === 'uploading' && (
                          <Loader2
                            className="w-4 h-4 animate-spin"
                            style={{ color: 'var(--app-accent)' }}
                          />
                        )}
                        {file.status === 'complete' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <CheckCircle2
                              className="w-4 h-4"
                              style={{ color: '#22c55e' }}
                            />
                          </motion.div>
                        )}
                        {file.status === 'error' && (
                          <div className="flex items-center gap-1">
                            <AlertCircle
                              className="w-4 h-4 cursor-pointer"
                              style={{ color: '#ef4444' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                retryFile(file.id);
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="p-1 rounded-md hover:bg-[var(--app-hover-bg)] transition-colors"
                        style={{ color: 'var(--app-text-muted)' }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })}

                {/* Upload more button */}
                {completedCount > 0 && (
                  <div className="px-5 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--app-hover-bg)]"
                      style={{
                        color: 'var(--app-accent)',
                        border: '1px solid var(--app-accent-light)',
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Upload more
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
