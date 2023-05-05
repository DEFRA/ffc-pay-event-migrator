const config = {
  storageConnectionString: process.env.STORAGE_CONNECTION_STRING,
  useConnectionString: (process.env.USE_STORAGE_CONNECTION_STRING || 'true') === 'true',
  storageName: process.env.STORAGE_ACCOUNT_NAME,
  v1Table: 'payeventstore',
  paymentTable: 'payments',
  batchTable: 'batches',
  warningTable: 'warnings',
  completeMigration: (process.env.COMPLETE_MIGRATION || 'true') === 'true',
  createTables: (process.env.CREATE_TABLES || 'false') === 'true',
  textSummary: (process.env.TEXT_SUMMARY || 'true') === 'true',
}

if (!config.storageConnectionString) {
  throw new Error('STORAGE_CONNECTION_STRING is required')
}

if (config.createTables) {
  console.log('Storage tables will be created if they do not exist')
}

if (!config.completeMigration) {
  console.log('Migration will be run in dry-run mode. No data will be written to storage')
}

module.exports = config
