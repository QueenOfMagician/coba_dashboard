import type { WidgetConfig } from '../../types'

interface Props {
  widget: WidgetConfig
}

export function JsonDumpSection({ widget }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>
          This is the raw JSON configuration for this widget.
        </p>
        <textarea
          readOnly
          value={JSON.stringify(widget.fieldConfig, null, 2)}
          style={{
            width: '100%',
            height: '400px',
            padding: '12px',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            color: 'var(--text-primary)',
            fontFamily: 'monospace',
            fontSize: 11,
            resize: 'vertical',
            outline: 'none',
          }}
        />
      </div>
    </div>
  )
}
