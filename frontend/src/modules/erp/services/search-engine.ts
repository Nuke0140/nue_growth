// ============================================
// Fuzzy Search Engine — Client-Side Data Index
// ============================================

import {
  mockEmployees,
  mockProjects,
  mockTasks,
  mockApprovals,
  mockAssets,
  mockLeaveRequests,
} from '../data/mock-data';

import type { ErpPage } from '../types';

// ── Types ──────────────────────────────────────────────

export interface SearchResult {
  id: string;
  type: 'employee' | 'project' | 'task' | 'leave' | 'approval' | 'asset' | 'page';
  title: string;
  subtitle: string;
  icon: string; // lucide icon name
  action: () => void;
  matchFields: string[];
  score: number;
}

export interface SearchOptions {
  maxResults?: number;
  types?: SearchResult['type'][];
}

export interface SearchCallbacks {
  navigateTo: (page: ErpPage) => void;
  selectEmployee: (id: string) => void;
  selectProject: (id: string) => void;
}

// ── Fuzzy Matching ────────────────────────────────────

/**
 * Check if query characters appear in order within the target (fuzzy match).
 * Returns the number of matched characters.
 */
function fuzzyMatchCount(query: string, target: string): number {
  let qi = 0;
  let matched = 0;
  for (let ti = 0; ti < target.length && qi < query.length; ti++) {
    if (query[qi] === target[ti]) {
      qi++;
      matched++;
    }
  }
  return matched;
}

/**
 * Score a single field against the query.
 * Returns { score, matched } where score is 0-1 and matched indicates a hit.
 */
function scoreField(query: string, target: string): { score: number; matched: boolean } {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Exact substring match
  if (t.includes(q)) {
    // Bonus for starts-with
    if (t.startsWith(q)) return { score: 1.0, matched: true };
    return { score: 0.95, matched: true };
  }

  // Fuzzy match: all query chars appear in order
  const matched = fuzzyMatchCount(q, t);
  if (matched === q.length) {
    return { score: 0.5 * (matched / q.length), matched: true };
  }

  // Partial fuzzy match (some chars matched)
  if (matched > 0) {
    return { score: 0.3 * (matched / q.length), matched: true };
  }

  return { score: 0, matched: false };
}

// ── Page Index (navigation pages) ─────────────────────

interface PageEntry {
  id: string;
  label: string;
  icon: string;
  page: ErpPage;
  keywords: string[];
}

const pageEntries: PageEntry[] = [
  { id: 'page-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', page: 'ops-dashboard', keywords: ['home', 'overview', 'dashboard', 'ops'] },
  { id: 'page-projects', label: 'Projects', icon: 'FolderKanban', page: 'projects', keywords: ['projects', 'portfolios', 'clients'] },
  { id: 'page-tasks', label: 'Tasks Board', icon: 'Columns3', page: 'tasks-board', keywords: ['tasks', 'board', 'kanban', 'todo'] },
  { id: 'page-ai-ops', label: 'AI Intelligence', icon: 'Sparkles', page: 'ai-ops', keywords: ['ai', 'intelligence', 'insights', 'analytics'] },
  { id: 'page-employees', label: 'Employees', icon: 'User', page: 'employees', keywords: ['employees', 'team', 'staff', 'people'] },
  { id: 'page-departments', label: 'Departments', icon: 'Network', page: 'departments', keywords: ['departments', 'teams', 'org'] },
  { id: 'page-attendance', label: 'Attendance', icon: 'Clock', page: 'attendance', keywords: ['attendance', 'timesheet', 'check-in', 'absent'] },
  { id: 'page-leaves', label: 'Leaves', icon: 'CalendarOff', page: 'leaves', keywords: ['leaves', 'time off', 'vacation', 'holiday'] },
  { id: 'page-payroll', label: 'Payroll', icon: 'Banknote', page: 'payroll', keywords: ['payroll', 'salary', 'compensation', 'wages'] },
  { id: 'page-compensation', label: 'Compensation', icon: 'Wallet', page: 'compensation', keywords: ['compensation', 'benefits', 'ctc', 'package'] },
  { id: 'page-performance', label: 'Performance', icon: 'BarChart3', page: 'performance', keywords: ['performance', 'reviews', 'appraisal', 'kpi'] },
  { id: 'page-documents', label: 'Documents', icon: 'FolderOpen', page: 'documents', keywords: ['documents', 'files', 'policies', 'hr'] },
  { id: 'page-assets', label: 'Assets', icon: 'Monitor', page: 'assets', keywords: ['assets', 'equipment', 'hardware', 'laptop'] },
  { id: 'page-approvals', label: 'Approvals', icon: 'CheckCircle2', page: 'approvals', keywords: ['approvals', 'pending', 'authorize', 'sign-off'] },
];

// ── Index & Search Function ───────────────────────────

export function search(
  query: string,
  options: SearchOptions = {},
  callbacks?: SearchCallbacks
): SearchResult[] {
  const { maxResults = 50, types } = options;

  if (!query.trim() || !callbacks) return [];

  const q = query.trim();
  const results: SearchResult[] = [];

  // Helper to add a result if any field scores > 0
  const tryAdd = (
    type: SearchResult['type'],
    id: string,
    title: string,
    subtitle: string,
    icon: string,
    action: () => void,
    fields: string[]
  ) => {
    if (types && !types.includes(type)) return;

    let bestScore = 0;
    const matchFields: string[] = [];

    for (const field of fields) {
      const { score, matched } = scoreField(q, field);
      if (matched && score > bestScore) {
        bestScore = score;
      }
      if (matched && !matchFields.includes(field)) {
        matchFields.push(field);
      }
    }

    if (bestScore > 0) {
      results.push({ id, type, title, subtitle, icon, action, matchFields, score: bestScore });
    }
  };

  // ── Index: Employees ──
  for (const emp of mockEmployees) {
    tryAdd(
      'employee',
      emp.id,
      emp.name,
      `${emp.designation} · ${emp.department}`,
      'User',
      () => callbacks.selectEmployee(emp.id),
      [emp.name, emp.designation, emp.department, emp.email, emp.manager, emp.salaryBand]
    );
  }

  // ── Index: Projects ──
  for (const proj of mockProjects) {
    tryAdd(
      'project',
      proj.id,
      proj.name,
      `${proj.client} · ${proj.status}`,
      'FolderKanban',
      () => callbacks.selectProject(proj.id),
      [proj.name, proj.client, proj.accountManager, proj.status, proj.priority]
    );
  }

  // ── Index: Tasks ──
  for (const task of mockTasks) {
    const proj = mockProjects.find((p) => p.id === task.projectId);
    tryAdd(
      'task',
      task.id,
      task.title,
      `${task.assignee} · ${task.stage}${proj ? ` · ${proj.name}` : ''}`,
      'CheckSquare',
      () => callbacks.navigateTo('tasks-board'),
      [task.title, task.assignee, task.stage, task.description, proj?.name ?? '']
    );
  }

  // ── Index: Leave Requests ──
  for (const leave of mockLeaveRequests) {
    const emp = mockEmployees.find((e) => e.id === leave.employeeId);
    const name = emp?.name ?? leave.employeeId;
    tryAdd(
      'leave',
      leave.id,
      `${name} — ${leave.type} leave`,
      `${leave.startDate} to ${leave.endDate} · ${leave.status}`,
      'CalendarOff',
      () => callbacks.navigateTo('leaves'),
      [name, leave.type, leave.status, leave.reason, leave.approver]
    );
  }

  // ── Index: Approvals ──
  for (const approval of mockApprovals) {
    tryAdd(
      'approval',
      approval.id,
      approval.title,
      `${approval.requestedBy} · ${approval.status}`,
      'CheckCircle2',
      () => callbacks.navigateTo('approvals'),
      [approval.title, approval.requestedBy, approval.type, approval.status, approval.project ?? '']
    );
  }

  // ── Index: Assets ──
  for (const asset of mockAssets) {
    tryAdd(
      'asset',
      asset.id,
      asset.name,
      `${asset.type} · ${asset.assignedTo} · ${asset.status}`,
      'Monitor',
      () => callbacks.navigateTo('assets'),
      [asset.name, asset.type, asset.serialNo, asset.assignedTo, asset.status]
    );
  }

  // ── Index: Pages ──
  for (const page of pageEntries) {
    tryAdd(
      'page',
      page.id,
      page.label,
      'Navigate to page',
      page.icon,
      () => callbacks.navigateTo(page.page),
      [page.label, ...page.keywords]
    );
  }

  // Sort by score descending, then by type for stable grouping
  const typeOrder: Record<string, number> = {
    page: 0,
    employee: 1,
    project: 2,
    task: 3,
    leave: 4,
    approval: 5,
    asset: 6,
  };

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99);
  });

  return results.slice(0, maxResults);
}
