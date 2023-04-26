module.exports = {
  storageConnectionString: process.env.STORAGE_CONNECTION_STRING,
  v1Table: 'payeventstore',
  paymentTable: 'payments',
  batchTable: 'batches',
  holdTable: 'holds',
  warningTable: 'warnings'
}
