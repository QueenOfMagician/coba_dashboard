import { useDraggable } from '@dnd-kit/core'
import type { SchemaField } from '../../types'

interface Props {
  field: SchemaField
}

export function DraggableField({ field }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: field.key,
    data: field,
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 999 }
    : undefined

  return (
    <li
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 8px',
        borderRadius: 6,
        cursor: 'grab',
        fontSize: 12,
        opacity: isDragging ? 0.4 : 1,
        background: isDragging ? 'var(--bg-hover)' : 'transparent',
        transition: 'background 0.1s',
        userSelect: 'none',
        listStyle: 'none',
        color: field.role === 'measure' ? '#818cf8' : 'var(--text-primary)',
      }}
      {...listeners}
      {...attributes}
    >
      <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>⠿</span>
      <span style={{ flex: 1, fontWeight: 500 }}>{field.label ?? field.key}</span>
      <span style={{
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--text-muted)',
        background: 'var(--bg-elevated)',
        padding: '2px 4px',
        borderRadius: 4,
      }}>
        {field.type === 'integer' ? 'int' : field.type === 'float' ? 'num' : field.type === 'date' ? 'date' : 'str'}
      </span>
    </li>
  )
}
