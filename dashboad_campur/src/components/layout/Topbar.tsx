import { useDashboardStore } from '../../store/dashboardStore'
import { ChartPickerDropdown } from '../chart-picker/ChartPickerDropdown'

interface Props {
  rowCount: number
  isLoading: boolean
  error: string | null
  onRefresh: () => void
}

export function Topbar({ rowCount, isLoading, error, onRefresh }: Props) {
  const { resetLayouts, widgets } = useDashboardStore()

  return (
    <header style={{
      height: 52,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(10px)',
      zIndex: 50,
    }}>
      {/* Left: Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 28, height: 28,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
          boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
        }}>
          📊
        </div>
        <div>
          <h1 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
            Analytics Dashboard
          </h1>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1, marginTop: 2 }}>
            DuckDB-WASM • ECharts • No Backend
          </p>
        </div>

        {/* Status badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '3px 10px',
          borderRadius: 20,
          background: error ? 'rgba(239,68,68,0.1)' : isLoading ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${error ? 'rgba(239,68,68,0.3)' : isLoading ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
          fontSize: 10,
          color: error ? '#ef4444' : isLoading ? '#f59e0b' : '#10b981',
          fontWeight: 500,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'currentColor',
            ...(isLoading ? { animation: 'pulse-glow 1.5s infinite' } : {}),
          }} />
          {isLoading ? 'Memuat data...' : error ? 'Error' : `${rowCount.toLocaleString()} baris`}
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {widgets.length > 1 && (
          <button
            id="btn-reset-layout"
            onClick={resetLayouts}
            title="Reset semua posisi widget"
            style={{
              padding: '7px 12px',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              color: 'var(--text-secondary)',
              fontSize: 11,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            ⊞ Reset Layout
          </button>
        )}

        <button
          id="btn-refresh"
          onClick={onRefresh}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '7px 12px',
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            color: 'var(--text-secondary)',
            fontSize: 11,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          <span className={isLoading ? 'spinner' : ''} style={{ display: 'inline-block', fontSize: 12 }}>⟳</span>
          Refresh
        </button>

        <ChartPickerDropdown />
      </div>
    </header>
  )
}
