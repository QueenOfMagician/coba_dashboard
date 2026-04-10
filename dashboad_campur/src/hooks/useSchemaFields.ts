import type { SchemaField, FieldType, FieldRole } from '../types'

export function inferRole(type: FieldType): FieldRole {
  return type === 'integer' || type === 'float' ? 'measure' : 'dimension'
}

export function buildSchemaFields(
  apiRecord: { key: string; type: FieldType }[]
): SchemaField[] {
  return apiRecord.map(({ key, type }) => ({
    key,
    type,
    role: inferRole(type),
    label: key,
  }))
}

export function splitByRole(fields: SchemaField[]) {
  return {
    dimensions: fields.filter((f) => f.role === 'dimension'),
    measures:   fields.filter((f) => f.role === 'measure'),
  }
}
