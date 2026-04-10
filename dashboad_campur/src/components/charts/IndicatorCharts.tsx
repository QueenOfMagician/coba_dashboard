import * as echarts from 'echarts/core'
import { RadarChart, FunnelChart, GaugeChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'

echarts.use([
  TooltipComponent,
  LegendComponent,
  RadarChart,
  FunnelChart,
  GaugeChart,
  CanvasRenderer
])

const COLOR_PALETTES: Record<string, string[]> = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
  monochrome: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7', '#ecf0f1'],
  pastel: ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94'],
  vibrant: ['#ff0080', '#ff8c00', '#40e0d0', '#00ff00', '#00bfff', '#bf00ff'],
}

interface Props {
  data: Record<string, unknown>[]
  categoryField?: string
  valueField?: string
  customize?: Record<string, any>
}

export function RadarWidget({ data, categoryField, valueField, customize = {} }: Props) {
  if (!categoryField || !valueField || data.length === 0) return null
  
  const indicators = data.map(r => ({
    name: String(categoryField ? (r[categoryField] ?? '') : ''),
    max: Math.max(...data.map(d => Number(valueField ? (d[valueField] ?? 0) : 0))) * 1.2 || 100
  }))

  const radarData = data.map(r => Number(valueField ? (r[valueField] ?? 0) : 0))

  const { colorPalette = 'default' } = customize
  const colors = COLOR_PALETTES[colorPalette as keyof typeof COLOR_PALETTES] || COLOR_PALETTES.default

  const option = {
    color: colors,
    tooltip: { trigger: 'item' },
    legend: { show: true, bottom: 0, textStyle: { color: 'var(--text-muted)' } },
    radar: { indicator: indicators },
    series: [{
      name: 'Budget vs spending',
      type: 'radar',
      data: [{ value: radarData, name: 'Allocated Budget' }]
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}

export function FunnelWidget({ data, categoryField, valueField }: Props) {
  if (!categoryField || !valueField || data.length === 0) return null
  
  const funnelData = data.map(r => ({
    name: String(r[categoryField] ?? ''),
    value: Number(r[valueField] ?? 0)
  }))

  const option = {
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c}' },
    legend: { data: funnelData.map(d => d.name), bottom: 0 },
    series: [{
      name: 'Funnel',
      type: 'funnel',
      left: '10%',
      top: 60,
      bottom: 60,
      width: '80%',
      min: 0,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: { show: true, position: 'inside' },
      labelLine: { show: false, length: 10, lineStyle: { width: 1, type: 'solid' } },
      itemStyle: { borderColor: '#fff', borderWidth: 1 },
      emphasis: { label: { fontSize: 20 } },
      data: funnelData
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}

export function GaugeWidget({ data, valueField, customize = {} }: Props) {
  if (!valueField || data.length === 0) return null
  
  const val = Number(data[0][valueField] ?? 0)

  const { colorPalette = 'default' } = customize
  const colors = COLOR_PALETTES[colorPalette as keyof typeof COLOR_PALETTES] || COLOR_PALETTES.default

  const option = {
    color: colors,
    tooltip: { formatter: '{a} <br/>{b} : {c}%' },
    series: [{
      name: 'Pressure',
      type: 'gauge',
      detail: { formatter: '{value}', textStyle: { color: 'var(--text-primary)' } },
      data: [{ value: val, name: 'Value' }]
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}
