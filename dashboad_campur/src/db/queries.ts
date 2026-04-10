import { getDB } from './duckdb'

export async function runQuery(sql: string): Promise<Record<string, unknown>[]> {
  const db = await getDB()
  const conn = await db.connect()
  try {
    const result = await conn.query(sql)
    return result.toArray().map((row) => row.toJSON())
  } finally {
    await conn.close()
  }
}

export async function getTableSchema(tableName = 'survey'): Promise<{ column_name: string; column_type: string }[]> {
  const db = await getDB()
  const conn = await db.connect()
  try {
    const result = await conn.query(`DESCRIBE ${tableName}`)
    return result.toArray().map((row) => row.toJSON()) as { column_name: string; column_type: string }[]
  } finally {
    await conn.close()
  }
}
