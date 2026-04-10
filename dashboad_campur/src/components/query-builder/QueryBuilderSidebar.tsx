import { useState } from 'react'
import { DndContext, type DragEndEvent, DragOverlay, closestCenter } from '@dnd-kit/core'
import QueryBuilder, { type RuleGroupType } from 'react-querybuilder'
import { FieldSection } from './FieldSection'
import { DroppableZone } from './DroppableZone'
import { useDashboardStore } from '../../store/dashboardStore'
import type { SchemaField, DroppedField, WidgetFieldConfig } from '../../types'
import { buildSQL } from './queryToDuckSQL'
import { useDuckDB } from '../../hooks/useDuckDB'
import { CHART_ZONES, UNIVERSAL_ZONES } from '../../config/chartConfigs'
import { CustomizeSection } from './CustomizeSection'
import { JsonDumpSection } from './JsonDumpSection'

interface Props {
  schema: SchemaField[]
  activeWidgetId: string | null
}

export function QueryBuilderSidebar({ schema, activeWidgetId }: Props) {
  const { widgets, updateWidgetFieldConfig } = useDashboardStore()
  const { execute } = useDuckDB()
  const [activeField, setActiveField] = useState<SchemaField | null>(null)
  
  const [showData, setShowData] = useState(true)
  const [showConfig, setShowConfig] = useState(true)
  const [activeTab, setActiveTab] = useState<'config' | 'customize' | 'json'>('config')

  const activeWidget = widgets.find((w) => w.id === activeWidgetId)
  
  if (!activeWidgetId || !activeWidget) return null

  const fieldConfig = activeWidget.fieldConfig

  const dimensions = schema.filter(f => f.type === 'string' || f.type === 'date')
  const measures = schema.filter(f => f.type === 'integer' || f.type === 'float')

  const qbFields = schema.map((f) => ({
    name: f.key,
    label: f.label ?? f.key,
    inputType: f.type === 'integer' || f.type === 'float' ? 'number' : f.type === 'date' ? 'date' : 'text',
  }))

  const update = (partial: Partial<WidgetFieldConfig>) => {
    updateWidgetFieldConfig(activeWidgetId, partial)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveField(null)
    const { over, active } = event
    if (!over) return

    const field = active.data.current as SchemaField
    const overId = over.id as string
    
    const zonesDef = CHART_ZONES[activeWidget.type] || []
    const targetZone = [...zonesDef, ...UNIVERSAL_ZONES].find(z => z.id === overId)
    if (!targetZone) return

    const zones = fieldConfig.zones || {}
    const zoneItems = zones[overId] || []
    
    if (zoneItems.length >= targetZone.maxItems) {
       const newItems = [...zoneItems]
       newItems[newItems.length - 1] = { 
         key: field.key, 
         aggregation: targetZone.role === 'measure' && field.role === 'measure' ? 'SUM' : undefined 
       }
       update({ zones: { ...zones, [overId]: newItems } })
    } else {
       if (!zoneItems.find((f) => f.key === field.key)) {
         update({ 
           zones: { 
             ...zones, 
             [overId]: [...zoneItems, { 
               key: field.key, 
               aggregation: targetZone.role === 'measure' && field.role === 'measure' ? 'SUM' : undefined 
             }] 
           } 
         })
       }
    }
  }

  const runWidgetQuery = async () => {
    const sql = buildSQL(activeWidget.type, 'survey', fieldConfig)
    console.log('Running SQL:', sql)
    await execute(sql)
  }

  const zonesDef = CHART_ZONES[activeWidget.type] || []

  return (
    <div style={{
      position: 'absolute',
      top: 0, right: 0, bottom: 0,
      display: 'flex',
      pointerEvents: 'none', // Prevent blocking clicks to the dashboard bg
      zIndex: 100,
      gap: 12,
      padding: '12px',
      alignItems: 'stretch'
    }}>
      <DndContext collisionDetection={closestCenter} onDragStart={(e) => setActiveField(e.active.data.current as SchemaField)} onDragEnd={handleDragEnd}>
        {/* Toggle Buttons for hidden panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'auto', alignSelf: 'flex-start' }}>
          {!showData && (
            <button onClick={() => setShowData(true)} style={{ padding: '8px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: 'var(--text-primary)', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)' }}>📁 Tampilkan Data</button>
          )}
          {!showConfig && (
            <button onClick={() => setShowConfig(true)} style={{ padding: '8px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: 'var(--text-primary)', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)' }}>⚙️ Tampilkan Config</button>
          )}
        </div>

        {/* DATA PANEL */}
        {showData && (
          <aside style={{
            width: 250,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>📁 Data Fields</p>
              <button title="Sembunyikan panel" onClick={() => setShowData(false)} style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 6px', fontSize: 10 }}>Tutup</button>
            </div>
            {/* Using minHeight: 0 to allow flex overflow children to scroll */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
               <FieldSection title="Dimensions" icon="📊" fields={dimensions} />
               <FieldSection title="Measures" icon="📏" fields={measures} />
            </div>
          </aside>
        )}

        {/* CONFIG PANEL */}
        {showConfig && (
          <aside style={{
            width: 300,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>⚙️ {activeWidget.title}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Konfigurasi parameter</p>
              </div>
              <button title="Sembunyikan panel" onClick={() => setShowConfig(false)} style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 6px', fontSize: 10 }}>Tutup</button>
            </div>
            
            {/* TABS COMPONENT */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-base)' }}>
              <button 
                onClick={() => setActiveTab('config')}
                style={{ flex: 1, padding: '8px 4px', fontSize: 11, fontWeight: activeTab === 'config' ? 700 : 500, color: activeTab === 'config' ? 'var(--text-primary)' : 'var(--text-muted)', borderBottom: activeTab === 'config' ? '2px solid var(--accent)' : '2px solid transparent', background: 'transparent', cursor: 'pointer' }}
              >
                Config
              </button>
              <button 
                onClick={() => setActiveTab('customize')}
                style={{ flex: 1, padding: '8px 4px', fontSize: 11, fontWeight: activeTab === 'customize' ? 700 : 500, color: activeTab === 'customize' ? 'var(--text-primary)' : 'var(--text-muted)', borderBottom: activeTab === 'customize' ? '2px solid var(--accent)' : '2px solid transparent', background: 'transparent', cursor: 'pointer' }}
              >
                Customize
              </button>
              <button 
                onClick={() => setActiveTab('json')}
                style={{ flex: 1, padding: '8px 4px', fontSize: 11, fontWeight: activeTab === 'json' ? 700 : 500, color: activeTab === 'json' ? 'var(--text-primary)' : 'var(--text-muted)', borderBottom: activeTab === 'json' ? '2px solid var(--accent)' : '2px solid transparent', background: 'transparent', cursor: 'pointer' }}
              >
                JSON Dump
              </button>
            </div>

            <div className="custom-scrollbar" style={{ flex: 1, padding: '14px', overflowY: 'auto', minHeight: 0 }}>
              
              {activeTab === 'config' && (
                <>
                  {/* PRIMARY CHART ZONES */}
                  {zonesDef.map((zone) => {
                    const zones = fieldConfig.zones || {}
                    const items = zones[zone.id] || []
                    return (
                      <div key={zone.id}>
                        <DroppableZone id={zone.id} label={zone.label} items={items} onRemoveItem={(key) => update({ zones: { ...(fieldConfig.zones || {}), [zone.id]: items.filter((f) => f.key !== key) } })} />
                        {zone.role === 'measure' && items.length > 0 && (
                          <div style={{ marginBottom: 12, marginTop: -6, paddingLeft: 6 }}>
                            {items.map((f) => (
                              <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <span style={{ fontSize: 10, color: 'var(--text-secondary)', flex: 1 }}>Agg ({f.key})</span>
                                <select value={f.aggregation ?? 'SUM'} onChange={(e) => { const agg = e.target.value as DroppedField['aggregation']; update({ zones: { ...(fieldConfig.zones || {}), [zone.id]: items.map((y) => y.key === f.key ? { ...y, aggregation: agg } : y) } }) }} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--text-primary)', fontSize: 10, padding: '2px 4px', cursor: 'pointer' }}>
                                  <option value="SUM">SUM</option>
                                  <option value="AVG">AVG</option>
                                  <option value="COUNT">COUNT</option>
                                  <option value="MIN">MIN</option>
                                  <option value="MAX">MAX</option>
                                </select>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* UNIVERSAL MODIFIERS */}
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                      🔄 Advanced (Pivot/Modifiers)
                    </p>
                    {UNIVERSAL_ZONES.map((zone) => {
                      const items = (fieldConfig.zones || {})[zone.id] || []
                      return (
                        <div key={zone.id}>
                          <DroppableZone id={zone.id} label={zone.label} items={items} onRemoveItem={(key) => update({ zones: { ...(fieldConfig.zones || {}), [zone.id]: items.filter((f) => f.key !== key) } })} />
                          {zone.id === 'orderby' && items.length > 0 && (
                            <div style={{ marginBottom: 12, marginTop: -6, paddingLeft: 6 }}>
                              {items.map((f) => (
                                <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                  <span style={{ fontSize: 10, color: 'var(--text-secondary)', flex: 1 }}>Sort ({f.key})</span>
                                  <select value={f.aggregation ?? 'DESC'} onChange={(e) => { const dir = e.target.value as DroppedField['aggregation']; update({ zones: { ...(fieldConfig.zones || {}), [zone.id]: items.map((y) => y.key === f.key ? { ...y, aggregation: dir } : y) } }) }} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--text-primary)', fontSize: 10, padding: '2px 4px', cursor: 'pointer' }}>
                                    <option value="DESC">Tertinggi (DESC)</option>
                                    <option value="ASC">Terendah (ASC)</option>
                                  </select>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* FILTERS */}
                  <div style={{ marginBottom: 12, marginTop: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                      🔽 Filters
                    </p>
                    <QueryBuilder fields={qbFields} query={fieldConfig.filters} onQueryChange={(q) => update({ filters: q as RuleGroupType })} />
                  </div>

                  <button onClick={runWidgetQuery} style={{ width: '100%', padding: '8px 12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
                    ▶ Run Query
                  </button>
                </>
              )}

              {activeTab === 'customize' && (
                <CustomizeSection widget={activeWidget} />
              )}

              {activeTab === 'json' && (
                <JsonDumpSection widget={activeWidget} />
              )}

            </div>
          </aside>
        )}

        <DragOverlay>
          {activeField && (
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--accent)', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#818cf8', fontWeight: 600, boxShadow: '0 4px 20px var(--accent-glow)', pointerEvents: 'none' }}>
              ⠿ {activeField.label ?? activeField.key}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
