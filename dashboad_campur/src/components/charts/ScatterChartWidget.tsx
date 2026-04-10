import * as echarts from 'echarts/core'
import { ScatterChart } from 'echarts/charts'
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
  ScatterChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent
])

interface Props {
  data: Record<string, unknown>[]
  xField?: string
  yField?: string
}

export function ScatterChartWidget({ data, xField, yField }: Props) {
  if (!xField || !yField || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4" style={{ color: 'var(--text-muted)' }}>
        <span style={{ fontSize: 32 }}>🔵</span>
        <p className="mt-2 text-xs">Drag field ke X-Axis dan Y-Axis</p>
      </div>
    )
  }

  const points = data.map((r) => [Number(r[xField] ?? 0), Number(r[yField] ?? 0)])

  const option = {
    backgroundColor: 'transparent',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tooltip: { backgroundColor: '#1a2235', borderColor: 'rgba(99,102,241,0.3)', textStyle: { color: '#f1f5f9' }, formatter: (params: any) => `${xField}: ${params.data[0]}<br/>${yField}: ${params.data[1]}` },
    grid: { top: 16, right: 16, bottom: 40, left: 50, containLabel: true },
    xAxis: { type: 'value', name: xField, nameTextStyle: { color: 'var(--text-muted)', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: 'var(--text-muted)', fontSize: 10 } },
    yAxis: { type: 'value', name: yField, nameTextStyle: { color: 'var(--text-muted)', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: 'var(--text-muted)', fontSize: 10 } },
    series: [{
      type: 'scatter',
      data: points,
      symbolSize: 6,
      itemStyle: { color: '#6366f1', opacity: 0.7 },
      emphasis: { itemStyle: { color: '#818cf8', opacity: 1 } },
    }],
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 120 }} />
}
