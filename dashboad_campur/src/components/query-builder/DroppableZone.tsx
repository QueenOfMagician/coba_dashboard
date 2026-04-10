import { useDroppable } from '@dnd-kit/core'
import type { DroppedField } from '../../types'

interface Props {
  id: string
  label: string
  items: DroppedField[]
  onRemoveItem: (key: string) => void
}

export function DroppableZone({ id, label, items, onRemoveItem }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id })

  const isEmpty = !items || items.length === 0

  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 6 }}>
        {label}
      </p>
      <div
        ref={setNodeRef}
        style={{
          minHeight: 40,
          borderRadius: 6,
          border: `1px dashed ${isOver ? 'var(--accent)' : 'var(--border-subtle)'}`,
          padding: '6px',
          background: isOver ? 'var(--accent-glow)' : 'var(--bg-elevated)',
          transition: 'all 0.15s',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          alignItems: 'center',
        }}
      >
        {isEmpty ? (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: 4 }}>
            {isOver ? '↓ Lepas di sini' : 'Tarik kolom ke sini...'}
          </span>
        ) : (
          items.map((f) => (
            <span key={f.key} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 4,
              padding: '2px 6px',
              fontSize: 11,
              color: '#818cf8',
              fontWeight: 500,
            }}>
              {f.key}
              <button
                onClick={() => onRemoveItem(f.key)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(99,102,241,0.6)', fontSize: 12, lineHeight: 1, padding: 0, marginLeft: 2 }}
              >×</button>
            </span>
          ))
        )}
      </div>
    </div>
  )
}
