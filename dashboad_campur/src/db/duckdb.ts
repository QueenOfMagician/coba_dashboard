import * as duckdb from '@duckdb/duckdb-wasm'

let dbInstance: duckdb.AsyncDuckDB | null = null

export async function getDB(): Promise<duckdb.AsyncDuckDB> {
  if (dbInstance) return dbInstance

  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles()
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES)
  const worker = await duckdb.createWorker(bundle.mainWorker!)
  const logger = new duckdb.ConsoleLogger()

  dbInstance = new duckdb.AsyncDuckDB(logger, worker)
  await dbInstance.instantiate(bundle.mainModule, bundle.pthreadWorker)

  return dbInstance
}
