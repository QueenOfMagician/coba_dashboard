export function EmptyState() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 16,
      color: 'var(--text-muted)',
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'var(--bg-elevated)',
        border: '2px dashed var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 32,
      }}>
        📊
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
          Dashboard Kosong
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Klik <strong style={{ color: 'var(--accent-light)' }}>+ Tambah Chart</strong> di atas untuk memulai
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Drag field dari sidebar untuk konfigurasi chart
        </p>
      </div>
    </div>
  )
}
