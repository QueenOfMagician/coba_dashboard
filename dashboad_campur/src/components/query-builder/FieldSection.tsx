import { useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DraggableField } from './DraggableField'
import type { SchemaField } from '../../types'

interface Props {
  title: string
  icon: string
  fields: SchemaField[]
  defaultOpen?: boolean
}

export function FieldSection({ title, icon, fields, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <button
        id={`field-section-${title.toLowerCase().replace(/\s/g,'-')}`}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          transition: 'background 0.1s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <span>{icon} {title} <span style={{ opacity: 0.5 }}>({fields.length})</span></span>
        <span style={{ fontSize: 8 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <SortableContext items={fields.map((f) => f.key)} strategy={verticalListSortingStrategy}>
          <ul className="custom-scrollbar" style={{ padding: '0 4px 6px 4px', margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
            {fields.length === 0 ? (
              <li style={{ padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Tidak ada field
              </li>
            ) : (
              fields.map((field) => <DraggableField key={field.key} field={field} />)
            )}
          </ul>
        </SortableContext>
      )}
    </div>
  )
}
