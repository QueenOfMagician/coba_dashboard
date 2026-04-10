import type { WidgetType, FieldRole } from '../types'

export interface DropZoneConfig {
  id: string
  label: string
  role: FieldRole | 'any'
  maxItems: number
}

export const CHART_ZONES: Record<WidgetType, DropZoneConfig[]> = {
  line: [
    { id: 'x', label: 'X-Axis (Dim)', role: 'dimension', maxItems: 1 },
    { id: 'y', label: 'Y-Axis (Meas)', role: 'measure', maxItems: 5 },
  ],
  area: [
    { id: 'x', label: 'X-Axis (Dim)', role: 'dimension', maxItems: 1 },
    { id: 'y', label: 'Y-Axis (Meas)', role: 'measure', maxItems: 5 },
  ],
  bar: [
    { id: 'x', label: 'X-Axis (Dim)', role: 'dimension', maxItems: 1 },
    { id: 'y', label: 'Y-Axis (Meas)', role: 'measure', maxItems: 5 },
  ],
  bar_horizontal: [
    { id: 'y', label: 'Y-Axis (Dim)', role: 'dimension', maxItems: 1 },
    { id: 'x', label: 'X-Axis (Meas)', role: 'measure', maxItems: 5 },
  ],
  radar: [
    { id: 'category', label: 'Category', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Value', role: 'measure', maxItems: 5 },
  ],
  pie: [
    { id: 'category', label: 'Category', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Value', role: 'measure', maxItems: 1 },
  ],
  donut: [
    { id: 'category', label: 'Category', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Value', role: 'measure', maxItems: 1 },
  ],
  treemap: [
    { id: 'category', label: 'Hierarchy', role: 'dimension', maxItems: 3 },
    { id: 'value', label: 'Value', role: 'measure', maxItems: 1 },
  ],
  histogram: [
    { id: 'x', label: 'Distribution (Meas)', role: 'measure', maxItems: 1 },
  ],
  scatter: [
    { id: 'x', label: 'X-Axis (Meas)', role: 'measure', maxItems: 1 },
    { id: 'y', label: 'Y-Axis (Meas)', role: 'measure', maxItems: 1 },
    { id: 'category', label: 'Category (Color)', role: 'dimension', maxItems: 1 },
  ],
  heatmap: [
    { id: 'x', label: 'X-Axis (Dim)', role: 'dimension', maxItems: 1 },
    { id: 'y', label: 'Y-Axis (Dim)', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Value (Meas)', role: 'measure', maxItems: 1 },
  ],
  kpi: [
    { id: 'value', label: 'Metric', role: 'measure', maxItems: 1 },
  ],
  gauge: [
    { id: 'value', label: 'Metric', role: 'measure', maxItems: 1 },
  ],
  table: [
    { id: 'columns', label: 'Columns', role: 'any', maxItems: 20 },
  ],
  pivot: [
    { id: 'rows', label: 'Rows', role: 'dimension', maxItems: 3 },
    { id: 'columns', label: 'Columns', role: 'dimension', maxItems: 3 },
    { id: 'value', label: 'Value', role: 'measure', maxItems: 1 },
  ],
  map_choropleth: [
    { id: 'location', label: 'Location Code', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Metric', role: 'measure', maxItems: 1 },
  ],
  map_point: [
    { id: 'lat', label: 'Latitude', role: 'measure', maxItems: 1 },
    { id: 'lon', label: 'Longitude', role: 'measure', maxItems: 1 },
    { id: 'value', label: 'Size/Metric', role: 'measure', maxItems: 1 },
  ],
  map_lines: [
    { id: 'from', label: 'From', role: 'dimension', maxItems: 1 },
    { id: 'to', label: 'To', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Volume', role: 'measure', maxItems: 1 },
  ],
  pictorialBar: [
    { id: 'x', label: 'Category', role: 'dimension', maxItems: 1 },
    { id: 'y', label: 'Value', role: 'measure', maxItems: 1 },
  ],
  polar: [
    { id: 'radius', label: 'Radius', role: 'dimension', maxItems: 1 },
    { id: 'angle', label: 'Angle', role: 'measure', maxItems: 1 },
  ],
  sunburst: [
    { id: 'category', label: 'Hierarchy', role: 'dimension', maxItems: 3 },
    { id: 'value', label: 'Value', role: 'measure', maxItems: 1 },
  ],
  sankey: [
    { id: 'source', label: 'Source', role: 'dimension', maxItems: 1 },
    { id: 'target', label: 'Target', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Value', role: 'measure', maxItems: 1 },
  ],
  tree: [
    { id: 'parent', label: 'Parent', role: 'dimension', maxItems: 1 },
    { id: 'child', label: 'Child', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Value', role: 'measure', maxItems: 1 },
  ],
  effectScatter: [
    { id: 'x', label: 'X-Axis', role: 'measure', maxItems: 1 },
    { id: 'y', label: 'Y-Axis', role: 'measure', maxItems: 1 },
    { id: 'value', label: 'Size', role: 'measure', maxItems: 1 },
  ],
  boxplot: [
    { id: 'category', label: 'Category', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Values', role: 'measure', maxItems: 5 },
  ],
  funnel: [
    { id: 'category', label: 'Step', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Value', role: 'measure', maxItems: 1 },
  ],
  graph: [
    { id: 'source', label: 'Source', role: 'dimension', maxItems: 1 },
    { id: 'target', label: 'Target', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Edge', role: 'measure', maxItems: 1 },
  ],
  candlestick: [
    { id: 'x', label: 'Time', role: 'dimension', maxItems: 1 },
    { id: 'y', label: 'OHLC', role: 'measure', maxItems: 4 },
  ],
  themeRiver: [
    { id: 'x', label: 'Time', role: 'dimension', maxItems: 1 },
    { id: 'y', label: 'Value', role: 'measure', maxItems: 1 },
    { id: 'category', label: 'Theme', role: 'dimension', maxItems: 1 },
  ],
  parallel: [
    { id: 'axes', label: 'Dimensions', role: 'measure', maxItems: 10 },
  ],
  calendar: [
    { id: 'date', label: 'Date', role: 'dimension', maxItems: 1 },
    { id: 'value', label: 'Value', role: 'measure', maxItems: 1 },
  ],
}

export const UNIVERSAL_ZONES: DropZoneConfig[] = [
  { id: 'groupby', label: 'Group By', role: 'dimension', maxItems: 3 },
  { id: 'splitby', label: 'Split By', role: 'dimension', maxItems: 1 },
  { id: 'orderby', label: 'Order By', role: 'any', maxItems: 1 },
]
