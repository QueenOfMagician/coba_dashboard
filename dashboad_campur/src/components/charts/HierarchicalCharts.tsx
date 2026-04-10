import * as echarts from 'echarts/core'
import { TreemapChart, SunburstChart, TreeChart, SankeyChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'

echarts.use([
  TooltipComponent,
  LegendComponent,
  TreemapChart,
  SunburstChart,
  TreeChart,
  SankeyChart,
  CanvasRenderer
])

interface Props {
  data: Record<string, unknown>[]
  categoryField?: string
  valueField?: string
  sourceField?: string
  targetField?: string
  parentField?: string
  childField?: string
}

export function TreemapWidget({ data, categoryField, valueField }: Props) {
  if (!categoryField || !valueField || data.length === 0) return null
  
  const treeData = data.map(r => ({
    name: String(categoryField ? (r[categoryField] ?? '') : ''),
    value: Number(valueField ? (r[valueField] ?? 0) : 0)
  }))

  const option = {
    tooltip: { trigger: 'item' },
    series: [{
      name: 'Treemap',
      type: 'treemap',
      visibleMin: 300,
      label: { show: true, formatter: '{b}' },
      itemStyle: { borderColor: '#fff' },
      levels: [
        { itemStyle: { borderWidth: 0, gapWidth: 5 } },
        { itemStyle: { gapWidth: 1 } },
        { colorSaturation: [0.35, 0.5], itemStyle: { gapWidth: 1, borderWidth: 5, borderColorSaturation: 0.6 } }
      ],
      data: treeData
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}

export function SunburstWidget({ data, categoryField, valueField }: Props) {
  if (!categoryField || !valueField || data.length === 0) return null
  
  const sunburstData = data.map(r => ({
    name: String(categoryField ? (r[categoryField] ?? '') : ''),
    value: Number(valueField ? (r[valueField] ?? 0) : 0)
  }))

  const option = {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'sunburst',
      data: sunburstData,
      radius: [0, '90%'],
      label: { rotate: 'radial' }
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}

export function SankeyWidget({ data, sourceField, targetField, valueField }: Props) {
  if (!sourceField || !targetField || !valueField || data.length === 0) return null
  
  const nodes = Array.from(new Set([
    ...data.map(r => String(r[sourceField])),
    ...data.map(r => String(r[targetField]))
  ])).map(name => ({ name }))

  const links = data.map(r => ({
    source: String(sourceField ? r[sourceField] : ''),
    target: String(targetField ? r[targetField] : ''),
    value: Number(valueField ? (r[valueField] ?? 0) : 0)
  }))

  const option = {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [{
      type: 'sankey',
      layout: 'none',
      emphasis: { focus: 'adjacency' },
      data: nodes,
      links: links
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}

export function TreeWidget({ data, parentField, childField, valueField }: Props) {
  if (!parentField || !childField || data.length === 0) return null
  
  // Basic tree construction (handles one level usually)
  const parents = Array.from(new Set(data.map(r => String(parentField ? r[parentField] : ''))))
  const treeItems = parents.map(p => ({
    name: p,
    children: data.filter(r => String(parentField ? r[parentField] : '') === p).map(r => ({
      name: String(childField ? r[childField] : ''),
      value: (valueField && childField) ? Number(r[valueField]) : undefined
    }))
  }))

  const option = {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [{
      type: 'tree',
      data: [{ name: 'Root', children: treeItems }],
      top: '1%',
      left: '7%',
      bottom: '1%',
      right: '20%',
      symbolSize: 7,
      label: { position: 'left', verticalAlign: 'middle', align: 'right', fontSize: 9 },
      leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' } },
      emphasis: { focus: 'descendant' },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750
    }]
  }

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', minHeight: 300 }} />
}
