interface Props {
  data: Record<string, unknown>[]
  columns?: string[]
}

export function TableWidget({ data, columns }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4" style={{ color: 'var(--text-muted)' }}>
        <span style={{ fontSize: 32 }}>📋</span>
        <p className="mt-2 text-xs">Belum ada data</p>
      </div>
    )
  }

  const cols = columns && columns.length > 0 ? columns : Object.keys(data[0] || {}).slice(0, 8)
  const rows = data.slice(0, 100)

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
        <thead>
          <tr style={{ position: 'sticky', top: 0, background: 'var(--bg-elevated)', zIndex: 1 }}>
            {cols.map((col) => (
              <th key={col} style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap', fontSize: 10 }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.1s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {cols.map((col) => (
                <td key={col} style={{ padding: '5px 10px', color: 'var(--text-primary)', whiteSpace: 'nowrap', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
