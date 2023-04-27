module.exports = {
  storageConnectionString: process.env.STORAGE_CONNECTION_STRING,
  v1Table: 'payeventstore',
  paymentTable: 'payments',
  batchTable: 'batches',
  warningTable: 'warnings',
  completeMigration: process.env.COMPLETE_MIGRATION ?? true
}
