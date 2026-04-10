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
  }

export function HistogramWidget({ data, xField }: Props) {
  if (!xField || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4" style={{ color: 'var(--text-muted)' }}>
        <span style={{ fontSize: 32 }}>📉</span>
        <p className="mt-2 text-xs">Drag field numerik ke X-Axis</p>
      </div>
    )
  }

  const vals = data.map((r) => Number(r[xField] ?? 0)).filter((v) => !isNaN(v))
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const bins = 10
  const binSize = (max - min) / bins || 1
  const counts = Array(bins).fill(0)
  vals.forEach((v) => {
    const idx = Math.min(Math.floor((v - min) / binSize), bins - 1)
    counts[idx]++
  })
  const labels = Array.from({ length: bins }, (_, i) => (min + i * binSize).toFixed(1))

  const option = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: '#1a2235', borderColor: 'rgba(99,102,241,0.3)', textStyle: { color: '#f1f5f9' } },
    grid: { top: 16, right: 16, bottom: 40, left: 50, containLabel: true },
    xAxis: { type: 'category', data: labels, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: 'var(--text-muted)', fontSize: 9 } },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: 'var(--text-muted)', fontSize: 10 } },
    series: [{
      type: 'bar',
      data: counts,
      barCategoryGap: '5%',
      itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#8b5cf6' }, { offset: 1, color: '#6366f1' }] }, borderRadius: [3, 3, 0, 0] },
    }],
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 120 }} />
}
