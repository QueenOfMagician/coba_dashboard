import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
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
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent
])

interface Props {
  data: Record<string, unknown>[]
  labelField?: string
  valueField?: string
  donut?: boolean
  customize?: Record<string, unknown>
}

const COLOR_PALETTES: Record<string, string[]> = {
  default: ['#6366f1','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#10b981','#3b82f6','#f97316','#06b6d4','#a855f7'],
  monochrome: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7', '#ecf0f1'],
  pastel: ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94'],
  vibrant: ['#ff0080', '#ff8c00', '#40e0d0', '#00ff00', '#00bfff', '#bf00ff'],
}

export function PieChartWidget({ data, labelField, valueField, donut = false, customize = {} }: Props) {
  if (!labelField || !valueField || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4" style={{ color: 'var(--text-muted)' }}>
        <span style={{ fontSize: 32 }}>🥧</span>
        <p className="mt-2 text-xs">Drag field Label dan Value</p>
      </div>
    )
  }

  const { 
    colorPalette = 'default', 
    showTooltip = true, 
  } = customize

  const colors = COLOR_PALETTES[colorPalette as keyof typeof COLOR_PALETTES] || COLOR_PALETTES.default

  const seriesData = data.slice(0, 10).map((r, i) => ({
    name: String(r[labelField] ?? ''),
    value: Number(r[valueField] ?? 0),
    itemStyle: { color: colors[i % colors.length] },
  }))

  const option = {
    color: colors,
    backgroundColor: 'transparent',
    tooltip: {
      show: showTooltip,
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: '#1a2235',
      borderColor: 'rgba(99,102,241,0.3)',
      textStyle: { color: '#f1f5f9' },
    },
    legend: {
      orient: 'horizontal',
      bottom: 4,
      textStyle: { color: 'var(--text-secondary)', fontSize: 10 },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [{
      type: 'pie',
      radius: donut ? ['45%', '70%'] : '65%',
      center: ['50%', '45%'],
      data: seriesData,
      label: { show: !donut, color: 'var(--text-secondary)', fontSize: 10 },
      labelLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
    }],
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 120 }} />
}
