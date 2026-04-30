'use client';

import React, { memo, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION, CSS, COLORS } from '@/styles/design-tokens';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Download,
  Save,
  Check,
  Eye,
  EyeOff,
  ChevronDown,
  Rows3,
  Rows4,
  Rows5,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SkeletonTable } from '@/components/shared/skeleton';

// ── Types ──────────────────────────────────────────────

export interface DataTableColumnDef {
  /** Unique key matching a property on the data row */
  key: string;
  /** Display label for the column header */
  label: string;
  /** Whether the column is sortable (default: false) */
  sortable?: boolean;
  /** Whether the column is initially visible (default: true) */
  visible?: boolean;
  /** Fixed pixel width */
  width?: number;
  /** Whether cells in this column support inline editing */
  editable?: boolean;
  /** Column data type hint */
  type?: 'text' | 'number' | 'date' | 'status' | 'badge' | 'currency';
}

export interface DataTableSavedView {
  id: string;
  name: string;
  page: string;
  filters?: Record<string, string | string[]>;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  hiddenColumns: string[];
  isDefault?: boolean;
}

export type DataTableDensity = 'compact' | 'normal' | 'comfortable';

interface SmartDataTableProps<T extends Record<string, unknown>> {
  /** Column definitions */
  columns: DataTableColumnDef[];
  /** Data rows */
  data: T[];
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Enable search input */
  searchable?: boolean;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Keys to search in (defaults to all column keys) */
  searchKeys?: string[];
  /** Message to show when table is empty */
  emptyMessage?: string;
  /** Rows per page (default: 10) */
  pageSize?: number;
  /** Saved views for the dropdown */
  savedViews?: DataTableSavedView[];
  /** Enable inline editing */
  enableInlineEdit?: boolean;
  /** Enable CSV export */
  enableExport?: boolean;
  /** Callback when column visibility changes */
  onColumnVisibilityChange?: (columns: string[]) => void;
  /** Callback when inline edit is committed */
  onInlineEdit?: (rowId: string, field: string, value: string) => void;
  /** Callback when a view is saved */
  onSaveView?: (view: DataTableSavedView) => void;
  /** Show loading skeleton state */
  loading?: boolean;
  /** Density preset */
  density?: DataTableDensity;
  /** Enable row selection */
  selectable?: boolean;
  /** Callback when selected rows change */
  onSelectionChange?: (selectedIds: Set<string>) => void;
  /** Additional class name */
  className?: string;
}

type SortDir = 'asc' | 'desc' | null;

// ── Density row padding map ────────────────────────────

const densityPadding: Record<DataTableDensity, string> = {
  compact: 'py-app-xs',
  normal: 'py-app-sm',
  comfortable: 'py-app-lg',
};

const densityCellPadding: Record<DataTableDensity, string> = {
  compact: 'px-app-md py-app-xs text-xs',
  normal: 'px-app-lg py-app-sm text-sm',
  comfortable: 'px-app-lg py-app-lg text-sm',
};

// ── Component ──────────────────────────────────────────

function SmartDataTableInner<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchKeys,
  emptyMessage = 'No data found.',
  pageSize: initialPageSize = 10,
  savedViews = [],
  enableInlineEdit = false,
  enableExport = false,
  onColumnVisibilityChange,
  onInlineEdit,
  onSaveView,
  loading = false,
  density = 'normal',
  selectable = false,
  onSelectionChange,
  className,
}: SmartDataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(0);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<{
    rowIdx: number;
    colKey: string;
  } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(initialPageSize);
  const inputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [focusedRow, setFocusedRow] = useState(-1);

  // Unique row id key
  const idKey = data.length > 0 && 'id' in data[0] ? 'id' : null;

  // ── Derived state ────────────────────────────────────

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    const keys = searchKeys || columns.map((c) => c.key);
    return data.filter((row) =>
      keys.some((k) => {
        const val = row[k];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchKeys, columns]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paged = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const visibleColumns = columns.filter(
    (c) => c.visible !== false && !hiddenCols.has(c.key)
  );

  // ── Handlers ─────────────────────────────────────────

  const handleSort = useCallback((key: string) => {
    setSortKey((prev) => {
      setSortDir((prevDir) => {
        if (prev === key) {
          if (prevDir === 'asc') return 'desc';
          if (prevDir === 'desc') {
            setSortKey(null);
            return null;
          }
        }
        return 'asc';
      });
      return prev === key ? prev : key;
    });
    setPage(0);
  }, []);

  const toggleColumn = useCallback((key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      onColumnVisibilityChange?.(
        columns.filter((c) => c.visible !== false && !next.has(c.key)).map((c) => c.key)
      );
      return next;
    });
  }, [columns, onColumnVisibilityChange]);

  const handleSaveView = useCallback(() => {
    const name = prompt('View name:');
    if (!name) return;
    const view: DataTableSavedView = {
      id: `view-${Date.now()}`,
      name,
      page: '',
      filters: {},
      hiddenColumns: Array.from(hiddenCols),
      isDefault: false,
      sortColumn: sortKey ?? undefined,
      sortDirection: sortDir ?? undefined,
    };
    onSaveView?.(view);
  }, [hiddenCols, sortKey, sortDir, onSaveView]);

  const handleApplyView = useCallback((view: DataTableSavedView) => {
    setActiveViewId(view.id);
    setHiddenCols(new Set(view.hiddenColumns));
    if (view.sortColumn) {
      setSortKey(view.sortColumn);
      setSortDir(view.sortDirection ?? 'asc');
    }
    setPage(0);
  }, []);

  // Inline editing
  const startEditing = useCallback((rowIdx: number, colKey: string) => {
    if (!enableInlineEdit) return;
    const row = paged[rowIdx];
    const colDef = columns.find((c) => c.key === colKey);
    if (!colDef?.editable) return;
    setEditingCell({ rowIdx, colKey });
    setEditValue(String(row[colKey] ?? ''));
    setTimeout(() => inputRef.current?.select(), 10);
  }, [enableInlineEdit, paged, columns]);

  const commitEdit = useCallback((rowIdx: number) => {
    if (!editingCell) return;
    const row = paged[rowIdx];
    const rowId = idKey ? String(row[idKey]) : String(rowIdx);
    onInlineEdit?.(rowId, editingCell.colKey, editValue);
    setEditingCell(null);
  }, [editingCell, paged, idKey, onInlineEdit, editValue]);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, []);

  // Row selection
  const toggleSelectAll = useCallback(() => {
    if (selectAll) {
      const cleared = new Set<string>();
      setSelectedIds(cleared);
      setSelectAll(false);
      onSelectionChange?.(cleared);
    } else {
      const newSet = new Set<string>(paged.map((r) => (idKey ? String(r[idKey]) : JSON.stringify(r))));
      setSelectedIds(newSet);
      setSelectAll(true);
      onSelectionChange?.(newSet);
    }
  }, [selectAll, paged, idKey, onSelectionChange]);

  const toggleRowSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set<string>(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onSelectionChange?.(next);
      return next;
    });
  }, [onSelectionChange]);

  // Keyboard navigation
  const handleTableKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (editingCell) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedRow((prev) => Math.min(prev + 1, paged.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedRow((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && focusedRow >= 0 && onRowClick) {
        e.preventDefault();
        onRowClick(paged[focusedRow]);
      } else if (e.key === 'Escape') {
        setFocusedRow(-1);
      }
    },
    [editingCell, focusedRow, onRowClick, paged]
  );

  useEffect(() => {
    setFocusedRow(-1);
  }, [data, page]);

  // CSV Export
  const handleExport = useCallback(() => {
    const headers = visibleColumns.map((c) => c.label).join(',');
    const rows = sorted.map((row) =>
      visibleColumns.map((c) => `"${String(row[c.key] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [sorted, visibleColumns]);

  // Show selection column when selectable is on or rows are selected
  const showSelectionColumn = selectable || selectedIds.size > 0;

  // ── Render ───────────────────────────────────────────

  return (
    <div className={cn('flex flex-col gap-4', className)} role="region" aria-label="Data table with toolbar">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {searchable && (
            <div className="relative max-w-sm flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: COLORS.searchIcon }}
                aria-hidden="true"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-[var(--app-radius-md)] border outline-none transition-colors"
                style={{
                  backgroundColor: CSS.hoverBg,
                  borderColor: CSS.borderStrong,
                  color: CSS.text,
                }}
                aria-label="Search table"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Density toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
                style={{ color: CSS.textSecondary }}
              >
                {density === 'compact' ? (
                  <Rows3 className="w-4 h-4 mr-1.5" />
                ) : density === 'comfortable' ? (
                  <Rows5 className="w-4 h-4 mr-1.5" />
                ) : (
                  <Rows4 className="w-4 h-4 mr-1.5" />
                )}
                Density
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 rounded-[var(--app-radius-lg)]"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.borderStrong }}
            >
              {(['compact', 'normal', 'comfortable'] as const).map((d) => (
                <DropdownMenuItem
                  key={d}
                  onClick={() => setPageSize(d === 'compact' ? 20 : d === 'comfortable' ? 5 : initialPageSize)}
                  className={cn(
                    'text-[13px] cursor-pointer capitalize',
                    density === d
                      ? 'text-[var(--app-accent)] bg-[var(--app-active-bg)]'
                      : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  {d}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Saved Views Dropdown */}
          {savedViews.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-xs hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
                  style={{ color: CSS.textSecondary }}
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  Views
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-[var(--app-radius-lg)]"
                style={{ backgroundColor: CSS.cardBg, borderColor: CSS.borderStrong }}
              >
                <DropdownMenuLabel className="text-xs" style={{ color: CSS.textMuted }}>
                  Saved Views
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ backgroundColor: CSS.border }} />
                {savedViews.map((view) => (
                  <DropdownMenuItem
                    key={view.id}
                    onClick={() => handleApplyView(view)}
                    className={cn(
                      'text-[13px] cursor-pointer',
                      view.id === activeViewId
                        ? 'text-[var(--app-accent)] bg-[var(--app-active-bg)]'
                        : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    {view.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
                style={{ color: CSS.textSecondary }}
              >
                <Settings2 className="w-4 h-4 mr-1.5" />
                Columns
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-[var(--app-radius-lg)]"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.borderStrong }}
            >
              <DropdownMenuLabel className="text-xs" style={{ color: CSS.textMuted }}>
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator style={{ backgroundColor: CSS.border }} />
              {columns.map((col) => (
                <DropdownMenuItem
                  key={col.key}
                  onClick={() => toggleColumn(col.key)}
                  className="flex items-center gap-2 text-[13px] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] cursor-pointer"
                >
                  {hiddenCols.has(col.key) ? (
                    <EyeOff className="w-4 h-4" style={{ color: CSS.textDisabled }} />
                  ) : (
                    <Eye className="w-4 h-4" style={{ color: CSS.accent }} />
                  )}
                  {col.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator style={{ backgroundColor: CSS.border }} />
              <DropdownMenuItem
                onClick={handleSaveView}
                className="text-[13px] cursor-pointer"
                style={{ color: CSS.accent }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Current View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          {enableExport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="h-8 px-2.5 text-xs hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
              style={{ color: CSS.textSecondary }}
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={5} columns={visibleColumns.length} />
      ) : (
        <div
          className="rounded-[var(--app-radius-xl)] overflow-hidden"
          style={{
            backgroundColor: CSS.cardBg,
            border: `1px solid ${CSS.border}`,
            boxShadow: CSS.shadowCard,
          }}
          role="grid"
          aria-label="Data table"
          onKeyDown={handleTableKeyDown}
          tabIndex={0}
          ref={tableRef}
        >
          <Table>
            <TableHeader>
              <TableRow
                className="border-b"
                style={{ borderColor: CSS.border }}
              >
                {/* Select all checkbox */}
                {showSelectionColumn && (
                  <TableHead className="w-10" style={{ color: CSS.textMuted }}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="rounded bg-transparent accent-[var(--app-accent)]"
                      style={{ borderColor: CSS.borderStrong }}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                )}
                {visibleColumns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      col.sortable && 'cursor-pointer select-none',
                      densityCellPadding[density]
                    )}
                    style={{ color: COLORS.text.muted }}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    aria-label={col.sortable ? `Sort by ${col.label}` : undefined}
                    role="columnheader"
                    tabIndex={col.sortable ? 0 : undefined}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && (
                        <ArrowUpDown
                          className={cn(
                            'w-4 h-4 transition-opacity',
                            sortKey === col.key ? 'opacity-100' : 'opacity-30'
                          )}
                          style={{ color: COLORS.text.muted }}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + (showSelectionColumn ? 1 : 0)}
                    className="h-32 text-center"
                    style={{ color: CSS.textMuted }}
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row, idx) => {
                  const rowId = idKey ? String(row[idKey]) : JSON.stringify(row);
                  const isFocused = focusedRow === idx;
                  return (
                    <TableRow
                      key={rowId}
                      tabIndex={0}
                      className={cn(
                        'border-b transition-colors',
                        densityPadding[density],
                        isFocused && 'ring-1 ring-inset'
                      )}
                      style={{
                        borderColor: COLORS.border.light,
                        cursor: onRowClick ? 'pointer' : undefined,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ...(isFocused ? { ['--tw-ring-color' as any]: `${CSS.accent}40` } : {}),
                      }}
                      role="row"
                      aria-selected={isFocused}
                      onClick={(e) => {
                        setFocusedRow(idx);
                        if (
                          editingCell?.rowIdx === idx ||
                          (e.target as HTMLElement).tagName === 'INPUT'
                        )
                          return;
                        onRowClick?.(row);
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = COLORS.overlayHover;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Row selection checkbox */}
                      {showSelectionColumn && (
                        <TableCell
                          style={{ color: COLORS.text.secondary }}
                          onClick={(e) => e.stopPropagation()}
                          role="gridcell"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.has(rowId)}
                            onChange={() => toggleRowSelect(rowId)}
                            className="rounded bg-transparent accent-[var(--app-accent)]"
                            style={{ borderColor: CSS.borderStrong }}
                            aria-label={`Select row ${idx + 1}`}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.map((col) => {
                        const isEditing =
                          editingCell?.rowIdx === idx &&
                          editingCell?.colKey === col.key;
                        const isEditable = enableInlineEdit && col.editable;

                        return (
                          <TableCell
                            key={col.key}
                            style={{ color: COLORS.text.secondary }}
                            role="gridcell"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              startEditing(idx, col.key);
                            }}
                          >
                            {isEditing ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  ref={inputRef}
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') commitEdit(idx);
                                    if (e.key === 'Escape') cancelEdit();
                                    if (e.key === 'Tab') {
                                      e.preventDefault();
                                      commitEdit(idx);
                                    }
                                  }}
                                  onBlur={() => commitEdit(idx)}
                                  className="text-sm px-2 py-1 w-full rounded-[var(--app-radius-md)] border outline-none"
                                  style={{
                                    backgroundColor: CSS.hoverBg,
                                    borderColor: `${CSS.accent}60`,
                                    color: CSS.text,
                                  }}
                                  autoFocus
                                  aria-label={`Edit ${col.label}`}
                                />
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={ANIMATION.springGentle}
                                  className="shrink-0"
                                  aria-hidden="true"
                                >
                                  <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                </motion.div>
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  isEditable &&
                                    'cursor-text hover:bg-[var(--app-hover-bg)] rounded px-1 -mx-1 py-0.5 transition-colors'
                                )}
                              >
                                {(row[col.key] as React.ReactNode) ?? '—'}
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs" style={{ color: CSS.textMuted }}>
            Showing {safePage * pageSize + 1}–
            {Math.min((safePage + 1) * pageSize, sorted.length)} of{' '}
            {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            {[10, 25, 50].map((size) => (
              <button
                key={size}
                onClick={() => {
                  setPageSize(size);
                  setPage(0);
                }}
                className="text-xs px-2.5 py-1 rounded-[var(--app-radius-lg)] cursor-pointer transition-colors disabled:opacity-60"
                disabled={size === pageSize}
                style={{
                  color: size === pageSize ? CSS.accent : CSS.textMuted,
                  backgroundColor: size === pageSize ? CSS.accentLight : 'transparent',
                }}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              style={{ color: CSS.textSecondary }}
              onClick={() => setPage(Math.max(0, safePage - 1))}
              disabled={safePage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs px-2" style={{ color: CSS.textSecondary }}>
              {safePage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              style={{ color: CSS.textSecondary }}
              onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
              disabled={safePage >= totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export const SmartDataTable = memo(SmartDataTableInner);
