import * as echarts from 'echarts/core'
import { GraphChart, ThemeRiverChart, ParallelChart, CandlestickChart, PictorialBarChart, ScatterChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  SingleAxisComponent,
  ParallelComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'

echarts.use([
  TooltipComponent,
  LegendComponent,
  GridComponent,
  SingleAxisComponent,
  ParallelComponent,
  GraphChart,
  ThemeRiverChart,
  ParallelChart,
  CandlestickChart,
  PictorialBarChart,
  ScatterChart,
  CanvasRenderer
])

interface Props {
  data: Record<string, unknown>[]
  xField?: string
  yField?: string
  categoryField?: string
  valueField?: string
  sourceField?: string
  targetField?: string
  axesFields?: string[]
}

export function GraphWidget({ data, sourceField, targetField, valueField }: Props) {
  if (!sourceField || !targetField || data.length === 0) return null
  
  const nodes = Array.from(new Set([
    ...data.map(r => String(r[sourceField])),
    ...data.map(r => String(r[targetField]))
  ])).map(name => ({ name, symbolSize: 20 }))

  const links = data.map(r => ({
    source: String(r[sourceField]),
    target: String(r[targetField]),
    lineStyle: { width: valueField ? Math.max(1, Number(r[valueField]) / 10) : 1 }
  }))

  const option = {
    tooltip: {},
    series: [{
      type: 'graph',
      layout: 'force',
      data: nodes,
      links: links,
      roam: true,
      label: { show: true, position: 'right' },
      force: { repulsion: 100 }
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}

export function ThemeRiverWidget({ data, xField, yField, categoryField }: Props) {
  if (!xField || !yField || !categoryField || data.length === 0) return null
  
  const riverData = data.map(r => [
    String(r[xField]),
    Number(r[yField] ?? 0),
    String(r[categoryField])
  ])

  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
    singleAxis: { top: 50, bottom: 50, type: 'time', axisPointer: { animation: true, label: { show: true } }, axisLine: { lineStyle: { color: '#333' } }, splitLine: { show: true, lineStyle: { type: 'dashed', opacity: 0.2 } } },
    series: [{
      type: 'themeRiver',
      emphasis: { itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0, 0, 0, 0.8)' } },
      data: riverData
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}

export function ParallelWidget({ data, axesFields }: Props) {
  if (!axesFields || axesFields.length === 0 || data.length === 0) return null
  
  const parallelData = data.map(r => axesFields.map(f => r[f]))

  const option = {
    parallelAxis: axesFields.map((f, i) => ({ dim: i, name: f })),
    series: {
      type: 'parallel',
      lineStyle: { width: 4 },
      data: parallelData
    }
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}

export function CandlestickWidget({ data, xField, yField }: Props) {
  if (!xField || !yField || data.length === 0) return null
  
  const categories = data.map(r => String(r[xField]))
  const chartData = data.map(r => {
    const val = r[yField]
    return Array.isArray(val) ? val : [val, val, val, val] // fallback
  })

  const option = {
    xAxis: { type: 'category', data: categories, scale: true, boundaryGap: false, axisLine: { onZero: false }, splitLine: { show: false }, min: 'dataMin', max: 'dataMax' },
    yAxis: { scale: true, splitArea: { show: true } },
    series: [{
      type: 'candlestick',
      data: chartData,
      itemStyle: { color: '#ec0000', color0: '#00da3c', borderColor: '#8A0000', borderColor0: '#008F28' }
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}

export function PictorialBarWidget({ data, xField, yField }: Props) {
  if (!xField || !yField || data.length === 0) return null
  
  const categories = data.map(r => String(r[xField]))
  const chartData = data.map(r => Number(r[yField]))

  const option = {
    xAxis: { data: categories, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: '#e54035' } },
    yAxis: { splitLine: { show: false }, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { show: false } },
    series: [{
      type: 'pictorialBar',
      barCategoryGap: '-100%',
      symbol: 'path://M0,10 L10,10 C5.5,10 5.5,0 5,0 C4.5,0 4.5,10 0,10 z',
      itemStyle: { opacity: 0.5 },
      emphasis: { itemStyle: { opacity: 1 } },
      data: chartData,
      z: 10
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}

export function EffectScatterWidget({ data, xField, yField, valueField }: Props) {
  if (!xField || !yField || data.length === 0) return null
  
  const chartData = data.map(r => [
    Number(r[xField] ?? 0),
    Number(r[yField] ?? 0),
    Number(valueField ? r[valueField] : 10)
  ])

  const option = {
    xAxis: { scale: true },
    yAxis: { scale: true },
    series: [{
      type: 'effectScatter',
      symbolSize: function (data: any) { return data[2]; },
      data: chartData
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}
