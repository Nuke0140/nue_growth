'use client';

import { useMemo } from 'react';
import { search, type SearchResult } from '../services/search-engine';
import { useErpStore } from '../erp-store';

export function useErpSearch(query: string, maxResults = 50): {
  results: SearchResult[];
  grouped: Record<string, SearchResult[]>;
  total: number;
} {
  const { navigateTo, selectEmployee, selectProject } = useErpStore();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return search(query, { maxResults }, { navigateTo, selectEmployee, selectProject });
  }, [query, navigateTo, selectEmployee, selectProject, maxResults]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    const typeLabels: Record<string, string> = {
      employee: 'Employees',
      project: 'Projects',
      task: 'Tasks',
      leave: 'Leaves',
      approval: 'Approvals',
      asset: 'Assets',
      page: 'Pages',
    };
    for (const r of results) {
      const label = typeLabels[r.type] || r.type;
      if (!groups[label]) groups[label] = [];
      groups[label].push(r);
    }
    return groups;
  }, [results]);

  return { results, grouped, total: results.length };
}
