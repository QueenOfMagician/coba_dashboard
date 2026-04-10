import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent
])

interface Props {
  data: Record<string, unknown>[]
  xField?: string
  yField?: string // Kept for interface compatibility
  horizontal?: boolean
  customize?: Record<string, unknown>
}

const COLOR_PALETTES: Record<string, string[]> = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
  monochrome: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7', '#ecf0f1'],
  pastel: ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94'],
  vibrant: ['#ff0080', '#ff8c00', '#40e0d0', '#00ff00', '#00bfff', '#bf00ff'],
}

export function BarChartWidget({ data, xField, horizontal = false, customize = {} }: Props) {
  if (!xField || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4" style={{ color: 'var(--text-muted)' }}>
        <span style={{ fontSize: 32 }}>📊</span>
        <p className="mt-2 text-xs">Konfigurasikan X-Axis / Group By terlebih dahulu</p>
      </div>
    )
  }

  const cats = data.map((r) => String(r[xField] ?? ''))
  
  // Ambil semua kolom selain xField sebagai series
  const seriesKeys = Object.keys(data[0]).filter(k => k !== xField)

  const { 
    colorPalette = 'default', 
    xAxisLabel = '', 
    yAxisLabel = '', 
    showTooltip = true, 
    showGrid = true, 
    borderRadius = 4 
  } = customize

  const series = seriesKeys.map((key) => ({
    name: key,
    type: 'bar',
    data: data.map((r) => Number(r[key] ?? 0)),
    barMaxWidth: 40,
    itemStyle: { borderRadius: horizontal ? [0, borderRadius, borderRadius, 0] : [borderRadius, borderRadius, 0, 0] },
  }))

  const colors = COLOR_PALETTES[colorPalette as keyof typeof COLOR_PALETTES] || COLOR_PALETTES.default

  const option = {
    color: colors,
    backgroundColor: 'transparent',
    tooltip: { show: showTooltip, trigger: 'axis', backgroundColor: '#1a2235', borderColor: 'rgba(99,102,241,0.3)', textStyle: { color: '#f1f5f9' } },
    legend: { show: seriesKeys.length > 1, type: 'scroll', top: 0, textStyle: { color: 'var(--text-secondary)', fontSize: 10 } },
    grid: { top: seriesKeys.length > 1 ? 30 : 20, right: 16, bottom: xAxisLabel ? 60 : 40, left: yAxisLabel ? 70 : 50, containLabel: true },
    xAxis: horizontal
      ? { type: 'value', name: xAxisLabel, nameLocation: 'middle', nameGap: 30, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, splitLine: { show: showGrid, lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: 'var(--text-muted)', fontSize: 10 } }
      : { type: 'category', name: xAxisLabel, nameLocation: 'middle', nameGap: 30, data: cats, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: 'var(--text-muted)', fontSize: 10, rotate: cats.length > 6 ? 30 : 0 } },
    yAxis: horizontal
      ? { type: 'category', name: yAxisLabel, nameLocation: 'middle', nameGap: 40, data: cats, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: 'var(--text-muted)', fontSize: 10 } }
      : { type: 'value', name: yAxisLabel, nameLocation: 'middle', nameGap: 40, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, splitLine: { show: showGrid, lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: 'var(--text-muted)', fontSize: 10 } },
    series: series,
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 120 }} />
}
