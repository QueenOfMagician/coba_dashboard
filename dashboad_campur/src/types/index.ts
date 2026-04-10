import type { RuleGroupType } from 'react-querybuilder'

export type Layouts = { [P: string]: LayoutItem[] }

// ── Field Types ──────────────────────────────────────────────────────────────
export type FieldType = 'date' | 'string' | 'integer' | 'float'
export type FieldRole = 'dimension' | 'measure'

export interface SchemaField {
  key: string
  type: FieldType
  role: FieldRole
  label?: string
}

export interface DroppedField {
  key: string
  aggregation?: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'
}

export interface WidgetFieldConfig {
  zones: Record<string, DroppedField[]>
  filters: RuleGroupType
  customize?: Record<string, unknown>
}

// ── Chart Types ──────────────────────────────────────────────────────────────
export type WidgetType =
  | 'line' | 'area'
  | 'bar' | 'bar_horizontal' | 'radar' | 'pictorialBar' | 'polar'
  | 'pie' | 'donut' | 'treemap' | 'sunburst' | 'sankey' | 'tree'
  | 'histogram' | 'scatter' | 'effectScatter' | 'heatmap' | 'boxplot'
  | 'kpi' | 'gauge' | 'funnel' | 'graph'
  | 'table' | 'pivot'
  | 'map_choropleth' | 'map_point' | 'map_lines'
  | 'candlestick' | 'themeRiver' | 'parallel' | 'calendar'


export interface WidgetConfig {
  id: string
  type: WidgetType
  title: string
  fieldConfig: WidgetFieldConfig
}

// ── Layout ───────────────────────────────────────────────────────────────────
export interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  maxW?: number
  minH?: number
  maxH?: number
  moved?: boolean
  static?: boolean
  isDraggable?: boolean
  isResizable?: boolean
  resizeHandles?: ('s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne')[]
  isBounded?: boolean
}

export interface DashboardStore {
  widgets: WidgetConfig[]
  layouts: Layouts
  schema: SchemaField[]
  isLoading: boolean
  error: string | null
}

// ── API ──────────────────────────────────────────────────────────────────────
export type ApiField = { key: string; value: string; type: FieldType }
export type ApiResponse = ApiField[][]
