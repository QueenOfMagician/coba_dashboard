import { useDashboardStore } from '../../store/dashboardStore'
import type { WidgetConfig } from '../../types'

interface Props {
  config: WidgetConfig
}

export function WidgetToolbar({ config }: Props) {
  const { removeWidget, setActiveWidget, activeWidgetId } = useDashboardStore()
  const isActive = activeWidgetId === config.id

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <button
        id={`btn-config-${config.id}`}
        title="Konfigurasi chart"
        onClick={(e) => {
          e.stopPropagation()
          setActiveWidget(isActive ? null : config.id)
        }}
        style={{
          background: isActive ? 'rgba(99,102,241,0.25)' : 'transparent',
          border: isActive ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
          borderRadius: 5,
          color: isActive ? '#818cf8' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '3px 6px',
          fontSize: 11,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
      >
        ⚙
      </button>
      <button
        id={`btn-delete-${config.id}`}
        title="Hapus widget"
        onClick={(e) => {
          e.stopPropagation()
          removeWidget(config.id)
        }}
        style={{
          background: 'transparent',
          border: '1px solid transparent',
          borderRadius: 5,
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '3px 6px',
          fontSize: 11,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        ✕
      </button>
    </div>
  )
}
