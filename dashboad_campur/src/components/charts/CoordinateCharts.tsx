import * as echarts from 'echarts/core'
import { HeatmapChart, BarChart, LineChart } from 'echarts/charts'
import {
  TooltipComponent,
  CalendarComponent,
  VisualMapComponent,
  PolarComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'

echarts.use([
  TooltipComponent,
  CalendarComponent,
  VisualMapComponent,
  PolarComponent,
  LegendComponent,
  HeatmapChart,
  BarChart,
  LineChart,
  CanvasRenderer
])

interface Props {
  data: Record<string, unknown>[]
  dateField?: string
  valueField?: string
  radiusField?: string
  angleField?: string
}

export function CalendarWidget({ data, dateField, valueField }: Props) {
  if (!dateField || !valueField || data.length === 0) return null
  
  const calendarData = data.map(r => [
    String(dateField ? r[dateField] : ''),
    Number(valueField ? (r[valueField] ?? 0) : 0)
  ])

  const option = {
    tooltip: { position: 'top' },
    visualMap: { min: 0, max: 1000, calculable: true, orient: 'horizontal', left: 'center', top: 'top' },
    calendar: [{ range: '2024', cellSize: ['auto', 20] }],
    series: [{
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: calendarData
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}

export function PolarWidget({ data, radiusField, angleField }: Props) {
  if (!radiusField || !angleField || data.length === 0) return null
  
  const polarData = data.map(r => [
    Number(radiusField ? (r[radiusField] ?? 0) : 0),
    Number(angleField ? (r[angleField] ?? 0) : 0)
  ])

  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: ['line'] },
    polar: {},
    angleAxis: { type: 'value', startAngle: 0 },
    radiusAxis: { min: 0 },
    series: [{
      coordinateSystem: 'polar',
      name: 'line',
      type: 'line',
      showSymbol: false,
      data: polarData
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 400 }} />
}
