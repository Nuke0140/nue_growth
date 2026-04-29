// ── Shared Components Barrel Export ──────────────────────
// Universal UI components used across all modules.
// All components use var(--app-*) CSS tokens — NO hardcoded colors.

export { SmartDataTable } from './smart-data-table';
export type { DataTableColumnDef, DataTableSavedView, DataTableDensity, SmartDataTableProps } from './smart-data-table';

export { CreateModal } from './create-modal';
export type { CreateModalProps, FormField, FormFieldType, FormFieldOption } from './create-modal';

export { ContextualSidebar } from './contextual-sidebar';
export type { ContextualSidebarProps } from './contextual-sidebar';

export { PageShell } from './page-shell';
export type { PageShellProps } from './page-shell';

export { FilterBar } from './filter-bar';

export { SearchInput } from './search-input';

export { StatusBadge } from './status-badge';

export { EmptyState } from './empty-state';
export type { EmptyStateProps, EmptyStateAction, EmptyStateIllustration } from './empty-state';

export { KpiWidget } from './kpi-widget';
export type { KpiWidgetProps, KpiColorVariant } from './kpi-widget';
