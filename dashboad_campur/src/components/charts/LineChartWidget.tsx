import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
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
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent
])

interface Props {
  data: Record<string, unknown>[]
  xField?: string
  yField?: string // Kept for interface compatibility
  title?: string
  type?: 'line' | 'area'
  customize?: Record<string, unknown>
}

const COLOR_PALETTES: Record<string, string[]> = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
  monochrome: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7', '#ecf0f1'],
  pastel: ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94'],
  vibrant: ['#ff0080', '#ff8c00', '#40e0d0', '#00ff00', '#00bfff', '#bf00ff'],
}

export function LineChartWidget({ data, xField, title, type = 'line', customize = {} }: Props) {
  if (!xField || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4" style={{ color: 'var(--text-muted)' }}>
        <span style={{ fontSize: 32 }}>📈</span>
        <p className="mt-2 text-xs">Konfigurasikan X-Axis / Group By terlebih dahulu</p>
      </div>
    )
  }

  const xData = data.map((r) => String(r[xField] ?? ''))
  
  // Ambil semua kolom selain xField sebagai series (mendukung pivot multi-kolom)
  const { 
    colorPalette = 'default', 
    xAxisLabel = '', 
    yAxisLabel = '', 
    showTooltip = true, 
    showGrid = true 
  } = customize

  const seriesKeys = Object.keys(data[0]).filter(k => k !== xField)

  const series = seriesKeys.map(key => ({
    name: key,
    type: 'line',
    data: data.map((r) => Number(r[key] ?? 0)),
    smooth: true,
    symbol: 'circle',
    symbolSize: 5,
    lineStyle: { width: 2 },
    areaStyle: type === 'area' ? { opacity: 0.1 } : undefined,
  }))

  const colors = COLOR_PALETTES[colorPalette as keyof typeof COLOR_PALETTES] || COLOR_PALETTES.default

  const option = {
    color: colors,
    backgroundColor: 'transparent',
    title: title ? { text: title, textStyle: { color: 'var(--text-secondary)', fontSize: 12 } } : undefined,
    tooltip: { show: showTooltip, trigger: 'axis', backgroundColor: '#1a2235', borderColor: 'rgba(99,102,241,0.3)', textStyle: { color: '#f1f5f9' } },
    legend: { show: seriesKeys.length > 1, type: 'scroll', top: 0, textStyle: { color: 'var(--text-secondary)', fontSize: 10 } },
    grid: { top: seriesKeys.length > 1 ? 30 : 20, right: 16, bottom: xAxisLabel ? 60 : 40, left: yAxisLabel ? 70 : 50, containLabel: true },
    xAxis: { type: 'category', name: xAxisLabel, nameLocation: 'middle', nameGap: 30, data: xData, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: 'var(--text-muted)', fontSize: 10, rotate: xData.length > 8 ? 30 : 0 } },
    yAxis: { type: 'value', name: yAxisLabel, nameLocation: 'middle', nameGap: 40, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, splitLine: { show: showGrid, lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: 'var(--text-muted)', fontSize: 10 } },
    series: series,
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 120 }} />
}
