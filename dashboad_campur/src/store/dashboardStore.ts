import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Layouts, WidgetConfig, LayoutItem, SchemaField, WidgetFieldConfig, WidgetType } from '../types'

interface DashboardState {
  widgets: WidgetConfig[]
  layouts: Layouts
  schema: SchemaField[]
  activeWidgetId: string | null

  // Actions
  setSchema: (schema: SchemaField[]) => void
  setLayouts: (layouts: Layouts) => void
  setActiveWidget: (id: string | null) => void
  addWidget: (type: WidgetType) => void
  removeWidget: (id: string) => void
  updateWidgetTitle: (id: string, title: string) => void
  updateWidgetFieldConfig: (id: string, config: Partial<WidgetFieldConfig>) => void
  resetLayouts: () => void
}

const defaultFieldConfig = (): WidgetFieldConfig => ({
  zones: {},
  filters: { combinator: 'and', rules: [] },
})

const CHART_LABELS: Record<WidgetType, string> = {
  line: 'Line Chart', area: 'Area Chart',
  bar: 'Bar Chart', bar_horizontal: 'Horizontal Bar', radar: 'Radar Chart',
  pie: 'Pie Chart', donut: 'Donut Chart', treemap: 'Treemap',
  histogram: 'Histogram', scatter: 'Scatter Plot', heatmap: 'Heatmap',
  kpi: 'KPI Card', gauge: 'Gauge',
  table: 'Data Table', pivot: 'Pivot Table',
  map_choropleth: 'Choropleth Map', map_point: 'Point Map',
  map_lines: 'Geo Lines', pictorialBar: 'Pictorial Bar',
  polar: 'Polar Plot', sunburst: 'Sunburst',
  sankey: 'Sankey Diagram', tree: 'Tree Diagram',
  effectScatter: 'Effect Scatter', boxplot: 'Boxplot',
  funnel: 'Funnel Chart', graph: 'Network Graph',
  candlestick: 'Candlestick Chart', themeRiver: 'Theme River',
  parallel: 'Parallel Plot', calendar: 'Calendar Heatmap',
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: [],
      layouts: { lg: [] },
      schema: [],
      activeWidgetId: null,

      setSchema: (schema) => set({ schema }),

      setLayouts: (layouts) => set({ layouts }),

      setActiveWidget: (id) => set({ activeWidgetId: id }),

      addWidget: (type) => {
        const id = `widget-${Date.now()}`
        const existingWidgets = get().widgets.length
        const col = (existingWidgets % 2) * 6
        const row = Math.floor(existingWidgets / 2) * 5

        const layoutItem: LayoutItem = {
          i: id,
          x: col,
          y: row,
          w: 6,
          h: type === 'kpi' ? 3 : 5,
          minW: 3,
          minH: 2,
        }

        const widget: WidgetConfig = {
          id,
          type,
          title: CHART_LABELS[type] || type,
          fieldConfig: defaultFieldConfig(),
        }

        set((state) => ({
          widgets: [...state.widgets, widget],
          layouts: {
            ...state.layouts,
            lg: [...(state.layouts.lg ?? []), layoutItem],
          },
        }))
      },

      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
          layouts: {
            ...state.layouts,
            lg: state.layouts.lg?.filter((l: LayoutItem) => l.i !== id) ?? [],
          },
          activeWidgetId: state.activeWidgetId === id ? null : state.activeWidgetId,
        })),

      updateWidgetTitle: (id, title) =>
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, title } : w)),
        })),

      updateWidgetFieldConfig: (id, config) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, fieldConfig: { ...w.fieldConfig, ...config } } : w
          ),
        })),

      resetLayouts: () =>
        set((state) => ({
          layouts: {
            ...state.layouts,
            lg: state.widgets.map((w, i) => ({
              i: w.id,
              x: (i % 2) * 6,
              y: Math.floor(i / 2) * 5,
              w: 6,
              h: w.type === 'kpi' ? 3 : 5,
              minW: 3,
              minH: 2,
            })),
          },
        })),
    }),
    {
      name: 'dashboard-layout',
      partialize: (state) => ({
        widgets: state.widgets,
        layouts: state.layouts,
        schema: state.schema,
      }),
    }
  )
)
