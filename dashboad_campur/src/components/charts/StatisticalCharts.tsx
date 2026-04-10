import * as echarts from 'echarts/core'
import { BoxplotChart, HeatmapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  BoxplotChart,
  HeatmapChart,
  CanvasRenderer,
  LegendComponent
])

interface Props {
  data: Record<string, unknown>[]
  xField?: string
  yField?: string
  valueField?: string
  customize?: Record<string, any>
}

export function BoxplotWidget({ data, xField }: Props) {
  if (!xField || data.length === 0) return null
  
  const categories = data.map(r => String(r[xField] ?? ''))
  const seriesKeys = Object.keys(data[0]).filter(k => k !== xField)
  const boxData = data.map(r => seriesKeys.map(k => Number(r[k] ?? 0)))

  const option = {
    tooltip: { trigger: 'item', axisPointer: { type: 'shadow' } },
    grid: { left: '10%', right: '10%', bottom: '15%' },
    xAxis: { type: 'category', data: categories, boundaryGap: true, nameGap: 30, splitArea: { show: false }, splitLine: { show: false } },
    yAxis: { type: 'value', splitArea: { show: true } },
    series: [{ name: 'boxplot', type: 'boxplot', data: boxData }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 200 }} />
}

export function HeatmapWidget({ data, xField, yField, valueField }: Props) {
  if (!xField || !yField || !valueField || data.length === 0) return null
  
  const xData = Array.from(new Set(data.map(r => String(r[xField] ?? ''))))
  const yData = Array.from(new Set(data.map(r => String(r[yField] ?? ''))))
  
  const heatmapData = data.map(r => [
    xData.indexOf(String(r[xField])),
    yData.indexOf(String(r[yField])),
    Number(r[valueField] ?? 0)
  ])

  const option = {
    tooltip: { position: 'top' },
    grid: { height: '50%', top: '10%' },
    xAxis: { type: 'category', data: xData, splitArea: { show: true } },
    yAxis: { type: 'category', data: yData, splitArea: { show: true } },
    visualMap: { min: 0, max: 100, calculeable: true, orient: 'horizontal', left: 'center', bottom: '15%' },
    series: [{ name: 'Heatmap', type: 'heatmap', data: heatmapData, label: { show: true } }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 200 }} />
}
