import type { RuleGroupType, RuleType } from 'react-querybuilder'
import type { WidgetFieldConfig, WidgetType } from '../../types'
import { CHART_ZONES } from '../../config/chartConfigs'

/** Converts react-querybuilder output into DuckDB SQL WHERE clauses */
function buildWhereClause(filters: RuleGroupType): string {
  if (!filters.rules || filters.rules.length === 0) return ''

  const processRule = (r: RuleType): string => {
    let val = r.value
    // Wrap strings in single quotes
    if (typeof val === 'string' && !['null', 'notNull'].includes(r.operator)) {
      val = `'${val.replace(/'/g, "''")}'`
    }
    switch (r.operator) {
      case '=': return `"${r.field}" = ${val}`
      case '!=': return `"${r.field}" != ${val}`
      case '<': return `"${r.field}" < ${val}`
      case '<=': return `"${r.field}" <= ${val}`
      case '>': return `"${r.field}" > ${val}`
      case '>=': return `"${r.field}" >= ${val}`
      case 'contains': return `"${r.field}" ILIKE '%${r.value}%'`
      case 'beginsWith': return `"${r.field}" ILIKE '${r.value}%'`
      case 'endsWith': return `"${r.field}" ILIKE '%${r.value}'`
      case 'null': return `"${r.field}" IS NULL`
      case 'notNull': return `"${r.field}" IS NOT NULL`
      case 'in': return `"${r.field}" IN (${r.value.split(',').map((v: string) => `'${v.trim()}'`).join(',')})`
      case 'notIn': return `"${r.field}" NOT IN (${r.value.split(',').map((v: string) => `'${v.trim()}'`).join(',')})`
      default: return `"${r.field}" = ${val}`
    }
  }

  const queries = filters.rules.map((rule) => {
    if ('rules' in rule) return `(${buildWhereClause(rule)})` // nested group
    return processRule(rule as RuleType)
  }).filter(Boolean)

  if (queries.length === 0) return ''
  return queries.join(` ${filters.combinator.toUpperCase()} `)
}

export function buildSQL(widgetType: WidgetType, tableName: string, config: WidgetFieldConfig): string {
  const zonesDef = CHART_ZONES[widgetType] || []
  const zones = config.zones || {}
  
  const dimensions: string[] = []
  const measures: string[] = []
  
  // 1. Extract chart-specific fields
  zonesDef.forEach(zone => {
    const items = zones[zone.id] || []
    if (zone.role === 'dimension') {
      items.forEach(item => dimensions.push(item.key))
    } else if (zone.role === 'measure') {
      items.forEach(item => {
        const agg = item.aggregation || 'SUM'
        measures.push(`${agg}("${item.key}") AS "${item.key}"`)
      })
    } else {
      // For 'any' role (like tables)
      items.forEach(item => dimensions.push(item.key))
    }
  })

  // 2. Extract Universal fields
  const groupByItems = zones['groupby'] || []
  groupByItems.forEach(item => dimensions.push(item.key))
  
  const splitByKey = (zones['splitby'] || [])[0]?.key
  const orderByItems = zones['orderby'] || []

  // Ensure unique elements to prevent duplicate SELECT/GROUP BY
  const uniqueDimensions = Array.from(new Set(dimensions))
  const uniqueMeasures = Array.from(new Set(measures))

  const whereSql = buildWhereClause(config.filters)
  const whereClause = whereSql ? `WHERE ${whereSql}` : ''
  const orderClause = orderByItems.length > 0 
    ? `ORDER BY ${orderByItems.map(item => `"${item.key}" ${item.aggregation || 'DESC'}`).join(', ')}`
    : ''

  // Fallback if empty config
  if (uniqueDimensions.length === 0 && uniqueMeasures.length === 0) {
    let sql = `SELECT * FROM ${tableName}`
    if (whereClause) sql += ` ${whereClause}`
    if (orderClause) sql += ` ${orderClause}`
    return sql + ' LIMIT 10'
  }

  // 3. PIVOT Target Mode
  if (splitByKey && uniqueDimensions.length > 0 && uniqueMeasures.length > 0) {
    const finalDimensions = uniqueDimensions.filter(d => d !== splitByKey)
    const usingClauses = uniqueMeasures.map(m => m.split(' AS ')[0]) // e.g., SUM("col")
    const sourceTable = whereClause ? `(SELECT * FROM ${tableName} ${whereClause})` : tableName
    
    let sql = `SELECT * FROM (\n  PIVOT ${sourceTable}\n  ON "${splitByKey}"\n  USING ${usingClauses.join(', ')}\n`
    if (finalDimensions.length > 0) {
      sql += `  GROUP BY ${finalDimensions.map(d => `"${d}"`).join(', ')}\n`
    }
    sql += `)`
    if (orderClause) sql += `\n${orderClause}`
    sql += `\nLIMIT 1000`
    return sql
  }

  // 4. Standard Aggregation Mode
  const selectCols = [...uniqueDimensions.map(d => `"${d}"`), ...uniqueMeasures]
  
  let sql = `SELECT\n  ${selectCols.join(',\n  ')}\nFROM ${tableName}`
  if (whereClause) sql += `\n${whereClause}`

  if (uniqueDimensions.length > 0 && uniqueMeasures.length > 0) {
    const groupCols = uniqueDimensions.map(d => `"${d}"`)
    sql += `\nGROUP BY ${groupCols.join(', ')}`
  }

  if (orderClause) sql += `\n${orderClause}`
  
  sql += `\nLIMIT 1000` // Precaution length limit
  return sql
}
