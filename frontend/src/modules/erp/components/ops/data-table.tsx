'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { COLORS } from '@/styles/design-tokens';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  hidden?: boolean;
  hiddenMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  emptyMessage?: string;
  pageSize?: number;
}

type SortDir = 'asc' | 'desc' | null;

export const DataTable = React.memo(function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchKeys,
  emptyMessage = 'No data found.',
  pageSize = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(0);
  const [focusedRow, setFocusedRow] = useState(-1);
  const tableRef = useRef<HTMLTableElement>(null);

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

  // Reset focused row on data change
  useEffect(() => {
    setFocusedRow(-1);
  }, [data, page]);

  const handleTableKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
    [focusedRow, onRowClick, paged]
  );

  const visibleColumns = columns.filter((c) => !c.hidden);

  return (
    <div className="flex flex-col gap-4">
      {searchable && (
        <div className="relative max-w-sm">
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

      <div className="ops-card overflow-hidden !p-0" role="grid" aria-label="Data table">
        <Table ref={tableRef} tabIndex={0} onKeyDown={handleTableKeyDown}>
          <TableHeader>
            <TableRow className="border-b" style={{ borderColor: 'var(--app-border)' }}>
              {visibleColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    col.sortable && 'cursor-pointer select-none',
                    col.hiddenMobile && 'hidden md:table-cell'
                  )}
                  style={{ color: 'var(--app-text-muted)' }}
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
                        style={{ color: 'var(--app-text-muted)' }}
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
                  colSpan={visibleColumns.length}
                  className="h-32 text-center"
                  style={{ color: 'var(--app-text-muted)' }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row, idx) => (
                <TableRow
                  key={idx}
                  className={cn(
                    'border-b transition-colors',
                    focusedRow === idx && 'ring-1 ring-inset ring-[rgba(204,92,55,0.25)]'
                  )}
                  style={{
                    borderColor: 'var(--app-border)',
                    cursor: onRowClick ? 'pointer' : undefined,
                  }}
                  role="row"
                  aria-selected={focusedRow === idx}
                  onClick={onRowClick ? () => { setFocusedRow(idx); onRowClick(row); } : undefined}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      COLORS.overlayHover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      'transparent';
                  }}
                >
                  {visibleColumns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(col.hiddenMobile && 'hidden md:table-cell')}
                      style={{ color: 'var(--app-text-secondary)' }}
                      role="gridcell"
                    >
                      {col.render
                        ? col.render(row)
                        : (row[col.key] as React.ReactNode) ?? '—'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
            Showing {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, sorted.length)} of{' '}
            {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            {[10, 25, 50].map((size) => (
              <button
                key={size}
                onClick={() => {
                  // pageSize is fixed via props but we provide visual feedback
                }}
                disabled={size === pageSize}
                className="ops-badge text-xs cursor-pointer disabled:opacity-60"
                style={{
                  color: size === pageSize ? 'var(--app-accent)' : 'var(--app-text-muted)',
                  backgroundColor:
                    size === pageSize ? 'var(--app-accent-light)' : 'transparent',
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
              style={{ color: 'var(--app-text-secondary)' }}
              onClick={() => setPage(Math.max(0, safePage - 1))}
              disabled={safePage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs px-2" style={{ color: 'var(--app-text-secondary)' }}>
              {safePage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              style={{ color: 'var(--app-text-secondary)' }}
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
});
