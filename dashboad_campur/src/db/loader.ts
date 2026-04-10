import type { ApiField, ApiResponse } from '../types'
import { getDB } from './duckdb'

// ── Mock data untuk fallback jika API tidak tersedia ─────────────────────────
const MOCK_DATA: ApiResponse = Array.from({ length: 120 }, (_, i) => {
  const dates = ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04',
                 '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08']
  const regions = ['Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'DKI Jakarta',
                   'Sumatera Utara', 'Sulawesi Selatan', 'Bali', 'Kalimantan Timur']
  const genders = ['L', 'P']
  const categories = ['A', 'B', 'C', 'D']

  return [
    { key: 'createdon',    value: `${dates[i % dates.length]}T${(i % 12).toString().padStart(2,'0')}:00:00.000Z`, type: 'date' },
    { key: 'finishon',     value: `${dates[i % dates.length]}T${((i % 12) + 1).toString().padStart(2,'0')}:00:00.000Z`, type: 'date' },
    { key: 'createdby',    value: regions[i % regions.length].toLowerCase().replace(' ','_') + `_user${i}`, type: 'string' },
    { key: 'kuesionerid',  value: String(600 + i), type: 'integer' },
    { key: 'region',       value: regions[i % regions.length], type: 'string' },
    { key: 'gender',       value: genders[i % genders.length], type: 'string' },
    { key: 'kategori',     value: categories[i % categories.length], type: 'string' },
    { key: 'A1',           value: String(Math.floor(Math.random() * 5) + 1), type: 'integer' },
    { key: 'A2',           value: String(Math.floor(Math.random() * 10) + 1), type: 'integer' },
    { key: 'B1',           value: String(Math.floor(Math.random() * 5) + 1), type: 'integer' },
    { key: 'B2',           value: String(Math.floor(Math.random() * 100) + 50), type: 'integer' },
    { key: 'score',        value: (Math.random() * 100).toFixed(2), type: 'float' },
    { key: 'duration_min', value: String(Math.floor(Math.random() * 60) + 20), type: 'integer' },
  ] as ApiField[]
})

// ── Type caster ───────────────────────────────────────────────────────────────
function castValue(value: string, type: ApiField['type']): unknown {
  if (value === null || value === undefined || value === '') return null
  switch (type) {
    case 'integer': return parseInt(value, 10)
    case 'float':   return parseFloat(value)
    case 'date':    return value
    default:        return value
  }
}

// ── Fetch & Transform ─────────────────────────────────────────────────────────
export async function fetchSurveyData(apiUrl: string): Promise<{ rows: Record<string, unknown>[], schema: { key: string; type: ApiField['type'] }[] }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const res = await fetch(apiUrl, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const raw: ApiResponse = await res.json()

    const rows = raw.map((fields) =>
      Object.fromEntries(fields.map(({ key, value, type }) => [key, castValue(value, type)]))
    )
    const schema = raw[0]?.map(({ key, type }) => ({ key, type })) || []
    
    return { rows, schema }
  } catch (err) {
    console.warn('⚠️ API tidak tersedia, menggunakan mock data:', err)

    const rows = MOCK_DATA.map((fields) =>
      Object.fromEntries(fields.map(({ key, value, type }) => [key, castValue(value, type)]))
    )
    const schema = MOCK_DATA[0]?.map(({ key, type }) => ({ key, type })) || []
    
    return { rows, schema }
  }
}

// ── Load into DuckDB ──────────────────────────────────────────────────────────
export async function loadAPIToDuckDB(
  apiUrl = '/api/',
  tableName = 'survey'
): Promise<{ rowCount: number; schema: { key: string; type: ApiField['type'] }[] }> {
  const { rows, schema } = await fetchSurveyData(apiUrl)
  if (rows.length === 0) throw new Error('Data kosong')

  const db = await getDB()
  await db.registerFileText(`${tableName}.json`, JSON.stringify(rows))

  const conn = await db.connect()
  await conn.query(`
    CREATE OR REPLACE TABLE ${tableName} AS
    SELECT * FROM read_json_auto('${tableName}.json')
  `)

  await conn.close()
  console.log(`✅ Tabel '${tableName}' siap — ${rows.length} baris`)

  return { rowCount: rows.length, schema }
}
