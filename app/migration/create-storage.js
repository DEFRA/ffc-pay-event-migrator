const { TableClient } = require('@azure/data-tables')
const { storageConnectionString, batchTable, paymentTable, warningTable, v1Table, createTables } = require('../config')

const createStorage = async () => {
  if (createTables) {
    const v1Client = TableClient.fromConnectionString(storageConnectionString, v1Table, { allowInsecureConnection: true })
    const batchClient = TableClient.fromConnectionString(storageConnectionString, batchTable, { allowInsecureConnection: true })
    const paymentClient = TableClient.fromConnectionString(storageConnectionString, paymentTable, { allowInsecureConnection: true })
    const warningClient = TableClient.fromConnectionString(storageConnectionString, warningTable, { allowInsecureConnection: true })
    await v1Client.createTable()
    await batchClient.createTable()
    await paymentClient.createTable()
    await warningClient.createTable()
  }
}

module.exports = {
  createStorage
}
