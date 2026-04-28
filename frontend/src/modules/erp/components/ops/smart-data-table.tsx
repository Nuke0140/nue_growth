'use client';

import React, { memo, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { COLORS, ANIMATION } from '../../design-tokens';
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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ColumnDef, SavedView, ErpPage } from '../../types';

interface SmartDataTableProps<T extends Record<string, unknown>> {
  columns: ColumnDef[];
  data: T[];
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  emptyMessage?: string;
  pageSize?: number;
  savedViews?: SavedView[];
  enableInlineEdit?: boolean;
  enableExport?: boolean;
  onColumnVisibilityChange?: (columns: string[]) => void;
  onInlineEdit?: (rowId: string, field: string, value: string) => void;
  onSaveView?: (view: SavedView) => void;
}

type SortDir = 'asc' | 'desc' | null;

function SmartDataTableInner<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchKeys,
  emptyMessage = 'No data found.',
  pageSize = 10,
  savedViews = [],
  enableInlineEdit = false,
  enableExport = false,
  onColumnVisibilityChange,
  onInlineEdit,
  onSaveView,
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
  const inputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [focusedRow, setFocusedRow] = useState(-1);

  // Unique row id key
  const idKey = 'id' in data[0] ? 'id' : null;

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
    (c) => !hiddenCols.has(c.key)
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') {
        setSortKey(null);
        setSortDir(null);
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const toggleColumn = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      onColumnVisibilityChange?.(
        columns.filter((c) => !next.has(c.key)).map((c) => c.key)
      );
      return next;
    });
  };

  const handleSaveView = () => {
    const name = prompt('View name:');
    if (!name) return;
    const view: SavedView = {
      id: `view-${Date.now()}`,
      name,
      page: 'ops-dashboard' as ErpPage,
      filters: {},
      hiddenColumns: Array.from(hiddenCols),
      isDefault: false,
      sortColumn: sortKey ?? undefined,
      sortDirection: sortDir ?? undefined,
    };
    onSaveView?.(view);
  };

  const handleApplyView = (view: SavedView) => {
    setActiveViewId(view.id);
    setHiddenCols(new Set(view.hiddenColumns));
    if (view.sortColumn) {
      setSortKey(view.sortColumn);
      setSortDir(view.sortDirection ?? 'asc');
    }
    setPage(0);
  };

  // Inline editing
  const startEditing = (rowIdx: number, colKey: string) => {
    if (!enableInlineEdit) return;
    const row = paged[rowIdx];
    const colDef = columns.find((c) => c.key === colKey);
    if (!colDef?.editable) return;
    setEditingCell({ rowIdx, colKey });
    setEditValue(String(row[colKey] ?? ''));
    setTimeout(() => inputRef.current?.select(), 10);
  };

  const commitEdit = (rowIdx: number) => {
    if (!editingCell) return;
    const row = paged[rowIdx];
    const rowId = idKey ? String(row[idKey]) : String(rowIdx);
    onInlineEdit?.(rowId, editingCell.colKey, editValue);
    setEditingCell(null);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // Bulk select
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
    } else {
      setSelectedIds(new Set(paged.map((r) => (idKey ? String(r[idKey]) : JSON.stringify(r)))));
      setSelectAll(true);
    }
  };

  const toggleRowSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Keyboard navigation handler for the table
  const handleTableKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (editingCell) return; // Don't navigate while editing

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

  // Reset focused row when data or page changes
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

  return (
    <div className="flex flex-col gap-4" role="region" aria-label="Table with toolbar">
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
                className="ops-input w-full pl-9 pr-4 py-2 text-sm"
                aria-label="Search table"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Saved Views Dropdown */}
          {savedViews.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-xs text-[rgba(245,245,245,0.5)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  Views
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-[#222325] border-[rgba(255,255,255,0.08)] rounded-xl"
              >
                <DropdownMenuLabel className="text-[rgba(245,245,245,0.4)] text-xs">
                  Saved Views
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.06)]" />
                {savedViews.map((view) => (
                  <DropdownMenuItem
                    key={view.id}
                    onClick={() => handleApplyView(view)}
                    className={cn(
                      'text-[13px] cursor-pointer',
                      view.id === activeViewId
                        ? 'text-[#cc5c37] bg-[rgba(204,92,55,0.08)]'
                        : 'text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]'
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
                className="h-8 px-2.5 text-xs text-[rgba(245,245,245,0.5)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
              >
                <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                Columns
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-[#222325] border-[rgba(255,255,255,0.08)] rounded-xl"
            >
              <DropdownMenuLabel className="text-[rgba(245,245,245,0.4)] text-xs">
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.06)]" />
              {columns.map((col) => (
                <DropdownMenuItem
                  key={col.key}
                  onClick={() => toggleColumn(col.key)}
                  className="flex items-center gap-2 text-[13px] text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)] cursor-pointer"
                >
                  {hiddenCols.has(col.key) ? (
                    <EyeOff className="w-3.5 h-3.5 text-[rgba(245,245,245,0.25)]" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-[#cc5c37]" />
                  )}
                  {col.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.06)]" />
              <DropdownMenuItem
                onClick={handleSaveView}
                className="text-[13px] text-[#cc5c37] hover:bg-[rgba(204,92,55,0.08)] cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 mr-2" />
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
              className="h-8 px-2.5 text-xs text-[rgba(245,245,245,0.5)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="ops-card overflow-hidden !p-0" role="grid" aria-label="Data table" onKeyDown={handleTableKeyDown} tabIndex={0}>
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow
              className="border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              {/* Bulk select checkbox */}
              {(selectAll || selectedIds.size > 0) && (
                <TableHead
                  className="w-10"
                  style={{ color: 'rgba(245,245,245,0.35)' }}
                >
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="rounded border-[rgba(255,255,255,0.15)] bg-transparent accent-[#cc5c37]"
                  />
                </TableHead>
              )}
              {visibleColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className={col.sortable ? 'cursor-pointer select-none' : undefined}
                  style={{ color: COLORS.textMuted }}
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
                          'w-3.5 h-3.5 transition-opacity',
                          sortKey === col.key
                            ? 'opacity-100'
                            : 'opacity-30'
                        )}
                        style={{ color: COLORS.textMuted }}
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
                  colSpan={visibleColumns.length + (selectAll || selectedIds.size > 0 ? 1 : 0)}
                  className="h-32 text-center"
                  style={{ color: 'rgba(245,245,245,0.35)' }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row, idx) => {
                const rowId = idKey ? String(row[idKey]) : JSON.stringify(row);
                return (
                  <TableRow
                    key={rowId}
                    tabIndex={0}
                    className={cn(
                      'border-b transition-colors',
                      focusedRow === idx && 'ring-1 ring-inset ring-[rgba(204,92,55,0.25)]'
                    )}
                    style={{
                      borderColor: COLORS.borderLight,
                      cursor: onRowClick ? 'pointer' : undefined,
                    }}
                    role="row"
                    aria-selected={focusedRow === idx}
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
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        COLORS.overlayHover;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        'transparent';
                    }}
                  >
                    {/* Bulk select */}
                    {(selectAll || selectedIds.size > 0) && (
                      <TableCell
                        style={{ color: COLORS.textSecondary }}
                        onClick={(e) => e.stopPropagation()}
                        role="gridcell"
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(rowId)}
                          onChange={() => toggleRowSelect(rowId)}
                          className="rounded border-[rgba(255,255,255,0.15)] bg-transparent accent-[#cc5c37]"
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
                          style={{ color: COLORS.textSecondary }}
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
                                className="ops-input text-sm px-2 py-1 w-full bg-[rgba(255,255,255,0.06)] border-[rgba(204,92,55,0.4)]"
                                autoFocus
                                aria-label={`Edit ${col.label}`}
                              />
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={ANIMATION.springBounce}
                                className="shrink-0"
                                aria-hidden="true"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              </motion.div>
                            </div>
                          ) : (
                            <div
                              className={cn(
                                isEditable &&
                                  'cursor-text hover:bg-[rgba(255,255,255,0.04)] rounded px-1 -mx-1 py-0.5 transition-colors'
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-[rgba(245,245,245,0.35)]">
            Showing {safePage * pageSize + 1}–
            {Math.min((safePage + 1) * pageSize, sorted.length)} of{' '}
            {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            {[10, 25, 50].map((size) => (
              <button
                key={size}
                disabled={size === pageSize}
                className="ops-badge text-xs cursor-pointer disabled:opacity-60"
                style={{
                  color:
                    size === pageSize
                      ? '#cc5c37'
                      : 'rgba(245,245,245,0.35)',
                  backgroundColor:
                    size === pageSize
                      ? 'rgba(204,92,55,0.1)'
                      : 'transparent',
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
              className="h-8 w-8 text-[rgba(245,245,245,0.6)]"
              onClick={() => setPage(Math.max(0, safePage - 1))}
              disabled={safePage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs px-2 text-[rgba(245,245,245,0.6)]">
              {safePage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[rgba(245,245,245,0.6)]"
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
