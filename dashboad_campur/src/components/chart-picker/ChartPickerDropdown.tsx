import { useState } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import type { WidgetType } from '../../types'

const CHART_CATEGORIES = [
  {
    category: 'Time Series',
    icon: '📈',
    types: [
      { type: 'line' as WidgetType, label: 'Line Chart', desc: 'Tren data sepanjang waktu' },
      { type: 'area' as WidgetType, label: 'Area Chart', desc: 'Tren dengan area terisi' },
    ],
  },
  {
    category: 'Comparison',
    icon: '📊',
    types: [
      { type: 'bar' as WidgetType, label: 'Bar Chart', desc: 'Perbandingan antar kategori' },
      { type: 'bar_horizontal' as WidgetType, label: 'Horizontal Bar', desc: 'Bar horizontal untuk label panjang' },
      { type: 'radar' as WidgetType, label: 'Radar Chart', desc: 'Perbandingan multi-dimensi' },
    ],
  },
  {
    category: 'Part of Whole',
    icon: '🥧',
    types: [
      { type: 'pie' as WidgetType, label: 'Pie Chart', desc: 'Proporsi tiap kategori' },
      { type: 'donut' as WidgetType, label: 'Donut Chart', desc: 'Seperti pie, dengan lubang tengah' },
      { type: 'treemap' as WidgetType, label: 'Treemap', desc: 'Proporsi dalam bentuk persegi' },
    ],
  },
  {
    category: 'Distribution',
    icon: '📉',
    types: [
      { type: 'histogram' as WidgetType, label: 'Histogram', desc: 'Distribusi frekuensi nilai' },
      { type: 'scatter' as WidgetType, label: 'Scatter Plot', desc: 'Korelasi dua variabel' },
      { type: 'heatmap' as WidgetType, label: 'Heatmap', desc: 'Intensitas data 2D' },
    ],
  },
  {
    category: 'Single Value',
    icon: '🔢',
    types: [
      { type: 'kpi' as WidgetType, label: 'KPI Card', desc: 'Metrik utama satu angka' },
      { type: 'gauge' as WidgetType, label: 'Gauge', desc: 'Nilai dalam rentang min-max' },
    ],
  },
  {
    category: 'Table',
    icon: '📋',
    types: [
      { type: 'table' as WidgetType, label: 'Data Table', desc: 'Tampilan data mentah' },
      { type: 'pivot' as WidgetType, label: 'Pivot Table', desc: 'Tabel ringkasan lintas dimensi' },
    ],
  },
  {
    category: 'Map',
    icon: '🗺️',
    types: [
      { type: 'map_choropleth' as WidgetType, label: 'Choropleth Map', desc: 'Peta warna per wilayah' },
      { type: 'map_point' as WidgetType, label: 'Point Map', desc: 'Titik pada peta geografis' },
    ],
  },
] as const

export function ChartPickerDropdown() {
  const [open, setOpen] = useState(false)
  const [hoveredCat, setHoveredCat] = useState<string | null>(null)
  const { addWidget } = useDashboardStore()

  const handleAdd = (type: WidgetType) => {
    addWidget(type)
    setOpen(false)
    setHoveredCat(null)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        id="btn-add-chart"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 14px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          borderRadius: 8,
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'opacity 0.15s',
          boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <span style={{ fontSize: 14 }}>＋</span>
        Tambah Chart
        <span style={{ fontSize: 9, opacity: 0.8 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            onClick={() => { setOpen(false); setHoveredCat(null) }}
          />

          {/* Dropdown Panel */}
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 100,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            display: 'flex',
            minWidth: 480,
            animation: 'fadeInUp 0.15s ease',
          }}>
            {/* Category List */}
            <div style={{ width: 180, borderRight: '1px solid var(--border-subtle)', padding: '6px 0' }}>
              {CHART_CATEGORIES.map((cat) => (
                <div
                  key={cat.category}
                  onMouseEnter={() => setHoveredCat(cat.category)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    background: hoveredCat === cat.category ? 'var(--bg-hover)' : 'transparent',
                    transition: 'background 0.1s',
                    borderLeft: hoveredCat === cat.category ? '2px solid var(--accent)' : '2px solid transparent',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{cat.icon}</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: hoveredCat === cat.category ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {cat.category}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{cat.types.length} chart</p>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>›</span>
                </div>
              ))}
            </div>

            {/* Chart Type List */}
            <div style={{ flex: 1, padding: '6px 0' }}>
              {hoveredCat ? (
                CHART_CATEGORIES.find((c) => c.category === hoveredCat)?.types.map((ct) => (
                  <div
                    key={ct.type}
                    onClick={() => handleAdd(ct.type)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      padding: '10px 16px',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{ct.label}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{'desc' in ct ? (ct as {desc?: string}).desc : ''}</p>
                  </div>
                ))
              ) : (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>← Pilih kategori chart</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
