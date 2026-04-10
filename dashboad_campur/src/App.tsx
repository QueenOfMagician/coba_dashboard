import { useEffect, useState, useCallback, useRef } from 'react'
import { AppShell } from './components/layout/AppShell'
import { loadAPIToDuckDB } from './db/loader'
import { useDashboardStore } from './store/dashboardStore'
import { buildSchemaFields } from './hooks/useSchemaFields'

export default function App() {
  const [ready, setReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rowCount, setRowCount] = useState(0)
  const { schema, setSchema } = useDashboardStore()

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { rowCount: count, schema: rawSchema } = await loadAPIToDuckDB('/api/')
      setRowCount(count)
      const schemaFields = buildSchemaFields(rawSchema)
      setSchema(schemaFields)
      setReady(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setReady(true)
    } finally {
      setIsLoading(false)
    }
  }, [setSchema])

  const initRef = useRef(false)
  useEffect(() => {
    if (import.meta.env.DEV && initRef.current) return
    initRef.current = true
    loadData()
  }, [loadData])

  if (!ready && isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-base)',
        gap: 20,
      }}>
        <div style={{
          width: 48, height: 48,
          border: '3px solid var(--border-subtle)',
          borderTop: '3px solid var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            Menginisialisasi DuckDB-WASM...
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            Memuat engine query dan data
          </p>
        </div>
      </div>
    )
  }

  return (
    <AppShell
      rowCount={rowCount}
      isLoading={isLoading}
      error={error}
      onRefresh={loadData}
      schema={schema}
    />
  )
}
