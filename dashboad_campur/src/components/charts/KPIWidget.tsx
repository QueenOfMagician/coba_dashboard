interface Props {
  data: Record<string, unknown>[]
  valueField?: string
  label?: string
}

export function KPIWidget({ data, valueField, label }: Props) {
  if (!valueField || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4" style={{ color: 'var(--text-muted)' }}>
        <span style={{ fontSize: 32 }}>🔢</span>
        <p className="mt-2 text-xs">Drag field numerik ke Value</p>
      </div>
    )
  }

  const vals = data.map((r) => Number(r[valueField] ?? 0)).filter((v) => !isNaN(v))
  const total = vals.reduce((a, b) => a + b, 0)
  const avg = vals.length > 0 ? total / vals.length : 0

  const fmt = (n: number) =>
    n >= 1000000 ? `${(n / 1000000).toFixed(2)}M`
      : n >= 1000 ? `${(n / 1000).toFixed(1)}K`
      : n % 1 === 0 ? n.toFixed(0)
      : n.toFixed(2)

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
      <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label || valueField}
      </p>
      <p style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {fmt(total)}
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
          Avg: <strong style={{ color: 'var(--text-primary)' }}>{fmt(avg)}</strong>
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
          N: <strong style={{ color: 'var(--text-primary)' }}>{vals.length.toLocaleString()}</strong>
        </span>
      </div>
    </div>
  )
}
