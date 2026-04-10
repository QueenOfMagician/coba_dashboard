import { useDashboardStore } from '../../store/dashboardStore'
import type { WidgetConfig } from '../../types'

interface Props {
  widget: WidgetConfig
}

export function CustomizeSection({ widget }: Props) {
  const { updateWidgetFieldConfig } = useDashboardStore()
  
  const updateCustomize = (key: string, value: unknown) => {
    updateWidgetFieldConfig(widget.id, {
      customize: {
        ...(widget.fieldConfig.customize || {}),
        [key]: value
      }
    })
  }
  
  const customize = widget.fieldConfig.customize || {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4 }}>Color Palette</label>
        <select 
          value={(customize.colorPalette as string) || 'default'} 
          onChange={(e) => updateCustomize('colorPalette', e.target.value)}
          style={{ width: '100%', padding: '6px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--text-primary)', fontSize: 11 }}
        >
          <option value="default">Default</option>
          <option value="monochrome">Monochrome</option>
          <option value="pastel">Pastel</option>
          <option value="vibrant">Vibrant</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4 }}>X-Axis Label</label>
        <input 
          type="text" 
          value={(customize.xAxisLabel as string) || ''} 
          onChange={(e) => updateCustomize('xAxisLabel', e.target.value)}
          placeholder="Custom X-Axis Label"
          style={{ width: '100%', padding: '6px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--text-primary)', fontSize: 11 }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4 }}>Y-Axis Label</label>
        <input 
          type="text" 
          value={(customize.yAxisLabel as string) || ''} 
          onChange={(e) => updateCustomize('yAxisLabel', e.target.value)}
          placeholder="Custom Y-Axis Label"
          style={{ width: '100%', padding: '6px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--text-primary)', fontSize: 11 }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input 
          type="checkbox" 
          id="showTooltip"
          checked={customize.showTooltip !== false} 
          onChange={(e) => updateCustomize('showTooltip', e.target.checked)}
        />
        <label htmlFor="showTooltip" style={{ fontSize: 11, color: 'var(--text-primary)' }}>Show Tooltip</label>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input 
          type="checkbox" 
          id="showGrid"
          checked={customize.showGrid !== false} 
          onChange={(e) => updateCustomize('showGrid', e.target.checked)}
        />
        <label htmlFor="showGrid" style={{ fontSize: 11, color: 'var(--text-primary)' }}>Show Grid Lines</label>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4 }}>Rounded Corners (px)</label>
        <input 
          type="number" 
          value={(customize.borderRadius as number) ?? 4} 
          onChange={(e) => updateCustomize('borderRadius', parseInt(e.target.value, 10))}
          min="0"
          max="50"
          style={{ width: '100%', padding: '6px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--text-primary)', fontSize: 11 }}
        />
      </div>
    </div>
  )
}
