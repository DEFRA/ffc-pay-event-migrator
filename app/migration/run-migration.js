const { TableClient, odata } = require('@azure/data-tables')
const { storageConnectionString, v1Table, paymentTable, batchTable, warningTable } = require('../config')
const v1Client = TableClient.fromConnectionString(storageConnectionString, v1Table, { allowInsecureConnection: true })
const paymentClient = TableClient.fromConnectionString(storageConnectionString, paymentTable, { allowInsecureConnection: true })
const batchClient = TableClient.fromConnectionString(storageConnectionString, batchTable, { allowInsecureConnection: true })
const warningClient = TableClient.fromConnectionString(storageConnectionString, warningTable, { allowInsecureConnection: true })

const runMigration = async () => {
  const events = []
  const eventResults = v1Client.listEntities()
  for await (const event of eventResults) {
    events.push(event.EventType)
  }

  console.log([...new Set(events)])
}

module.exports = {
  runMigration
}
