import { DashboardGrid } from '../dashboard/DashboardGrid'
import { QueryBuilderSidebar } from '../query-builder/QueryBuilderSidebar'
import { Topbar } from './Topbar'
import { useDashboardStore } from '../../store/dashboardStore'
import type { SchemaField } from '../../types'

interface Props {
  rowCount: number
  isLoading: boolean
  error: string | null
  onRefresh: () => void
  schema: SchemaField[]
}

export function AppShell({ rowCount, isLoading, error, onRefresh, schema }: Props) {
  const { activeWidgetId } = useDashboardStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Topbar rowCount={rowCount} isLoading={isLoading} error={error} onRefresh={onRefresh} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Main dashboard area */}
        <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg-base)', position: 'relative' }}>
          <DashboardGrid />
          {/* Right sidebar */}
          <QueryBuilderSidebar schema={schema} activeWidgetId={activeWidgetId} />
        </main>
      </div>
    </div>
  )
}
