import { useState, useCallback } from 'react'
import { runQuery } from '../db/queries'

export function useDuckDB() {
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (sql: string) => {
    setLoading(true)
    setError(null)
    try {
      const rows = await runQuery(sql)
      setData(rows)
      return rows
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, execute }
}
