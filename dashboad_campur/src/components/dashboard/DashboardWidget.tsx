import { useEffect, useState, useMemo, lazy, Suspense } from 'react'
import type { WidgetConfig } from '../../types'
import { WidgetToolbar } from './WidgetToolbar'
import { useDashboardStore } from '../../store/dashboardStore'
import { buildSQL } from '../query-builder/queryToDuckSQL'
import { runQuery } from '../../db/queries'
import { CHART_ZONES } from '../../config/chartConfigs'

// Lazy load chart components
const LineChartWidget = lazy(() => import('../charts/LineChartWidget').then(m => ({ default: m.LineChartWidget })))
const BarChartWidget = lazy(() => import('../charts/BarChartWidget').then(m => ({ default: m.BarChartWidget })))
const PieChartWidget = lazy(() => import('../charts/PieChartWidget').then(m => ({ default: m.PieChartWidget })))
const HistogramWidget = lazy(() => import('../charts/HistogramWidget').then(m => ({ default: m.HistogramWidget })))
const KPIWidget = lazy(() => import('../charts/KPIWidget').then(m => ({ default: m.KPIWidget })))
const TableWidget = lazy(() => import('../charts/TableWidget').then(m => ({ default: m.TableWidget })))
const ScatterChartWidget = lazy(() => import('../charts/ScatterChartWidget').then(m => ({ default: m.ScatterChartWidget })))

// New specialized charts
const { BoxplotWidget, HeatmapWidget } = {
  BoxplotWidget: lazy(() => import('../charts/StatisticalCharts').then(m => ({ default: m.BoxplotWidget }))),
  HeatmapWidget: lazy(() => import('../charts/StatisticalCharts').then(m => ({ default: m.HeatmapWidget })))
}
const { TreemapWidget, SunburstWidget, SankeyWidget, TreeWidget } = {
  TreemapWidget: lazy(() => import('../charts/HierarchicalCharts').then(m => ({ default: m.TreemapWidget }))),
  SunburstWidget: lazy(() => import('../charts/HierarchicalCharts').then(m => ({ default: m.SunburstWidget }))),
  SankeyWidget: lazy(() => import('../charts/HierarchicalCharts').then(m => ({ default: m.SankeyWidget }))),
  TreeWidget: lazy(() => import('../charts/HierarchicalCharts').then(m => ({ default: m.TreeWidget })))
}
const { RadarWidget, FunnelWidget, GaugeWidget } = {
  RadarWidget: lazy(() => import('../charts/IndicatorCharts').then(m => ({ default: m.RadarWidget }))),
  FunnelWidget: lazy(() => import('../charts/IndicatorCharts').then(m => ({ default: m.FunnelWidget }))),
  GaugeWidget: lazy(() => import('../charts/IndicatorCharts').then(m => ({ default: m.GaugeWidget })))
}
const { GraphWidget, ThemeRiverWidget, ParallelWidget, CandlestickWidget, PictorialBarWidget, EffectScatterWidget } = {
  GraphWidget: lazy(() => import('../charts/SpecializedCharts').then(m => ({ default: m.GraphWidget }))),
  ThemeRiverWidget: lazy(() => import('../charts/SpecializedCharts').then(m => ({ default: m.ThemeRiverWidget }))),
  ParallelWidget: lazy(() => import('../charts/SpecializedCharts').then(m => ({ default: m.ParallelWidget }))),
  CandlestickWidget: lazy(() => import('../charts/SpecializedCharts').then(m => ({ default: m.CandlestickWidget }))),
  PictorialBarWidget: lazy(() => import('../charts/SpecializedCharts').then(m => ({ default: m.PictorialBarWidget }))),
  EffectScatterWidget: lazy(() => import('../charts/SpecializedCharts').then(m => ({ default: m.EffectScatterWidget })))
}
const { MapWidget, GeoLinesWidget } = {
  MapWidget: lazy(() => import('../charts/GeoCharts').then(m => ({ default: m.MapWidget }))),
  GeoLinesWidget: lazy(() => import('../charts/GeoCharts').then(m => ({ default: m.GeoLinesWidget })))
}
const { CalendarWidget, PolarWidget } = {
  CalendarWidget: lazy(() => import('../charts/CoordinateCharts').then(m => ({ default: m.CalendarWidget }))),
  PolarWidget: lazy(() => import('../charts/CoordinateCharts').then(m => ({ default: m.PolarWidget })))
}

interface Props {
  config: WidgetConfig
}

function LoadingPlaceholder() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div className="spinner" style={{
        width: 24, height: 24,
        border: '2px solid var(--border-subtle)',
        borderTop: '2px solid var(--accent)',
        borderRadius: '50%',
      }} />
    </div>
  )
}

export function DashboardWidget({ config }: Props) {
  const { activeWidgetId, setActiveWidget } = useDashboardStore()
  const isActive = activeWidgetId === config.id
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)

  const { fieldConfig, type } = config
  
  // Extract zone values defensively
  const zones = useMemo(() => fieldConfig.zones || {}, [fieldConfig.zones])
  
  const xKey = zones.x?.[0]?.key
  const yKey = zones.y?.[0]?.key
  const categoryKey = zones.category?.[0]?.key
  const valueKey = zones.value?.[0]?.key
  const sourceKey = zones.source?.[0]?.key
  const targetKey = zones.target?.[0]?.key
  const parentKey = zones.parent?.[0]?.key
  const childKey = zones.child?.[0]?.key
  const radiusKey = zones.radius?.[0]?.key
  const angleKey = zones.angle?.[0]?.key
  const dateKey = zones.date?.[0]?.key
  const locationKey = zones.location?.[0]?.key
  const fromKey = zones.from?.[0]?.key
  const toKey = zones.to?.[0]?.key
  const axesKeys = zones.axes?.map(i => i.key)


  // Stringify zones lightly to act as a dependency array trigger
  const zonesSig = useMemo(() => {
    return Object.entries(zones).map(([k, items]) => `${k}:${items.map(i => i.key + (i.aggregation||'')).join(',')}`).join('|')
  }, [zones])

  // Run query automatically when fieldConfig changes
  useEffect(() => {
    const zonesDef = CHART_ZONES[type] || []
    const hasAnyField = zonesDef.some(z => (zones[z.id] || []).length > 0)
    
    if (!hasAnyField) {
      if (data.length > 0) setData([])
      return
    }
    
    setLoading(true)
    const sql = buildSQL(type, 'survey', fieldConfig)
    
    runQuery(sql)
      .then((rows) => setData(rows))
      .catch((e) => console.error('Widget query error:', e))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zonesSig, fieldConfig.filters, type])

  function renderChart() {
    if (loading) return <LoadingPlaceholder />

    return (
      <Suspense fallback={<LoadingPlaceholder />}>
        {(() => {
          switch (type) {
            case 'line':
              return <LineChartWidget data={data} xField={xKey} yField={yKey} type="line" customize={config.fieldConfig.customize} />
            case 'area':
              return <LineChartWidget data={data} xField={xKey} yField={yKey} type="area" customize={config.fieldConfig.customize} />
            case 'bar':
              return <BarChartWidget data={data} xField={xKey} yField={yKey} customize={config.fieldConfig.customize} />
            case 'bar_horizontal':
              return <BarChartWidget data={data} xField={xKey} yField={yKey} horizontal customize={config.fieldConfig.customize} />
            case 'pie':
              return <PieChartWidget data={data} labelField={categoryKey} valueField={valueKey} customize={config.fieldConfig.customize} />
            case 'donut':
              return <PieChartWidget data={data} labelField={categoryKey} valueField={valueKey} donut customize={config.fieldConfig.customize} />
            case 'histogram':
              return <HistogramWidget data={data} xField={xKey} />
            case 'scatter':
              return <ScatterChartWidget data={data} xField={xKey} yField={yKey} />
            case 'kpi':
              return <KPIWidget data={data.length > 0 ? data : (valueKey ? [{[valueKey]: 0}] : [])} valueField={valueKey} label={config.title} />
            case 'treemap':
              return <TreemapWidget data={data} categoryField={categoryKey} valueField={valueKey} />
            case 'sunburst':
              return <SunburstWidget data={data} categoryField={categoryKey} valueField={valueKey} />
            case 'sankey':
              return <SankeyWidget data={data} sourceField={sourceKey} targetField={targetKey} valueField={valueKey} />
            case 'tree':
              return <TreeWidget data={data} parentField={parentKey} childField={childKey} valueField={valueKey} />
            case 'radar':
              return <RadarWidget data={data} categoryField={categoryKey} valueField={valueKey} customize={config.fieldConfig.customize} />
            case 'gauge':
              return <GaugeWidget data={data} valueField={valueKey} customize={config.fieldConfig.customize} />
            case 'funnel':
              return <FunnelWidget data={data} categoryField={categoryKey} valueField={valueKey} />
            case 'heatmap':
              return <HeatmapWidget data={data} xField={xKey} yField={yKey} valueField={valueKey} />
            case 'boxplot':
              return <BoxplotWidget data={data} xField={xKey} />
            case 'graph':
              return <GraphWidget data={data} sourceField={sourceKey} targetField={targetKey} valueField={valueKey} />
            case 'pictorialBar':
              return <PictorialBarWidget data={data} xField={xKey} yField={yKey} />
            case 'effectScatter':
              return <EffectScatterWidget data={data} xField={xKey} yField={yKey} valueField={valueKey} />
            case 'candlestick':
              return <CandlestickWidget data={data} xField={xKey} yField={yKey} />
            case 'themeRiver':
              return <ThemeRiverWidget data={data} xField={xKey} yField={yKey} categoryField={categoryKey} />
            case 'parallel':
              return <ParallelWidget data={data} axesFields={axesKeys} />
            case 'map_choropleth':
              return <MapWidget data={data} locationField={locationKey} valueField={valueKey} />
            case 'map_lines':
              return <GeoLinesWidget data={data} fromField={fromKey} toField={toKey} valueField={valueKey} />
            case 'calendar':
              return <CalendarWidget data={data} dateField={dateKey} valueField={valueKey} />
            case 'polar':
              return <PolarWidget data={data} radiusField={radiusKey} angleField={angleKey} />
            case 'table':
              return <TableWidget data={data} />
            case 'pivot':
              return <TableWidget data={data} /> // Placeholder for pivot
            default:
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 11, textAlign: 'center', padding: 20 }}>
                  <div>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>🚧</div>
                    {type} chart integration in progress
                  </div>
                </div>
              )

          }
        })()}
      </Suspense>
    )
  }

  return (
    <div
      onClick={() => setActiveWidget(config.id)}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-surface)',
        border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-subtle)'}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: isActive ? '0 0 0 1px rgba(99,102,241,0.3), 0 4px 20px rgba(99,102,241,0.1)' : '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Drag Handle Header */}
      <div
        className="widget-drag-handle"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          cursor: 'grab',
          flexShrink: 0,
          userSelect: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>⠿⠿</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
            {config.title}
          </span>
          {data.length > 0 && (
            <span style={{ fontSize: 9, color: 'var(--text-muted)', background: 'var(--bg-base)', padding: '1px 5px', borderRadius: 4 }}>
              {data.length} rows
            </span>
          )}
        </div>
        <WidgetToolbar config={config} />
      </div>

      {/* Chart content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: 8, minHeight: 0 }}>
        {renderChart()}
      </div>
    </div>
  )
}
