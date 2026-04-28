'use client';

import React, { useState, useMemo } from 'react';
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

export function DataTable<T extends Record<string, unknown>>({
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

  const visibleColumns = columns.filter((c) => !c.hidden);

  return (
    <div className="flex flex-col gap-4">
      {searchable && (
        <div className="relative max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--ops-text-muted)' }}
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
          />
        </div>
      )}

      <div className="ops-card overflow-hidden !p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b" style={{ borderColor: 'var(--ops-border)' }}>
              {visibleColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    col.sortable && 'cursor-pointer select-none',
                    col.hiddenMobile && 'hidden md:table-cell'
                  )}
                  style={{ color: 'var(--ops-text-muted)' }}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
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
                        style={{ color: 'var(--ops-text-muted)' }}
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
                  style={{ color: 'var(--ops-text-muted)' }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row, idx) => (
                <TableRow
                  key={idx}
                  className="border-b transition-colors"
                  style={{
                    borderColor: 'var(--ops-border)',
                    cursor: onRowClick ? 'pointer' : undefined,
                  }}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      'rgba(255,255,255,0.02)';
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
                      style={{ color: 'var(--ops-text-secondary)' }}
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
          <p className="text-xs" style={{ color: 'var(--ops-text-muted)' }}>
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
                  color: size === pageSize ? 'var(--ops-accent)' : 'var(--ops-text-muted)',
                  backgroundColor:
                    size === pageSize ? 'var(--ops-accent-light)' : 'transparent',
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
              style={{ color: 'var(--ops-text-secondary)' }}
              onClick={() => setPage(Math.max(0, safePage - 1))}
              disabled={safePage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs px-2" style={{ color: 'var(--ops-text-secondary)' }}>
              {safePage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              style={{ color: 'var(--ops-text-secondary)' }}
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
