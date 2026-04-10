import { Responsive, WidthProvider } from 'react-grid-layout/legacy'
import { DashboardWidget } from './DashboardWidget'
import { EmptyState } from './EmptyState'
import { useDashboardStore } from '../../store/dashboardStore'

const ResponsiveGridLayout = WidthProvider(Responsive)

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480 }
const cols        = { lg: 12,   md: 10,  sm: 6,   xs: 4   }

export function DashboardGrid() {
  const { widgets, layouts, setLayouts } = useDashboardStore()

  if (widgets.length === 0) {
    return <EmptyState />
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={breakpoints}
      cols={cols}
      rowHeight={72}
      draggableHandle=".widget-drag-handle"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onLayoutChange={(_current: any, all: any) => setLayouts(all)}
      resizeHandles={['se', 'sw']}
      margin={[12, 12]}
      containerPadding={[12, 12]}
    >
      {widgets.map((widget) => (
        <div key={widget.id} style={{ borderRadius: 12, overflow: 'hidden' }}>
          <DashboardWidget config={widget} />
        </div>
      ))}
    </ResponsiveGridLayout>
  )
}
