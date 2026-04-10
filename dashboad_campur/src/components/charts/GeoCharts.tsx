import * as echarts from 'echarts/core'
import { MapChart, LinesChart } from 'echarts/charts'
import {
  TooltipComponent,
  VisualMapComponent,
  GeoComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'

echarts.use([
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  MapChart,
  LinesChart,
  CanvasRenderer
])

interface Props {
  data: Record<string, unknown>[]
  locationField?: string
  valueField?: string
  fromField?: string
  toField?: string
}

export function MapWidget({ data, locationField, valueField }: Props) {
  if (!locationField || !valueField || data.length === 0) return null
  
  const mapData = data.map(r => ({
    name: String(locationField ? r[locationField] : ''),
    value: Number(valueField ? (r[valueField] ?? 0) : 0)
  }))

  const option = {
    tooltip: { trigger: 'item', formatter: '{b}<br/>{c}' },
    visualMap: { min: 0, max: 1000, left: 'left', top: 'bottom', text: ['High', 'Low'], calculable: true },
    series: [{
      name: 'Map Data',
      type: 'map',
      map: 'world', // Default to world
      roam: true,
      emphasis: { label: { show: true } },
      data: mapData
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 400 }} />
}

export function GeoLinesWidget({ data, fromField, toField, valueField }: Props) {
  if (!fromField || !toField || data.length === 0) return null
  
  // Requires coordinates. Simplification: Assume fields contain [lat, lon] or name
  const linesData = data.map(r => ({
    fromName: String(r[fromField]),
    toName: String(r[toField]),
    coords: [r[fromField], r[toField]], // Mocked
    value: valueField ? Number(r[valueField]) : 1
  }))

  const option = {
    geo: { map: 'world', roam: true, itemStyle: { areaColor: '#323c48', borderColor: '#404a59' } },
    series: [{
      type: 'lines',
      coordinateSystem: 'geo',
      data: linesData,
      lineStyle: { color: '#a6c84c', width: 1, opacity: 0.6, curveness: 0.2 },
      effect: { show: true, period: 6, trailLength: 0.7, color: '#fff', symbolSize: 3 }
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 400 }} />
}
