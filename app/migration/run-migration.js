const { TableClient } = require('@azure/data-tables')
const { storageConnectionString, v1Table, paymentTable, batchTable, warningTable } = require('../config')
const { createV2Event } = require('./create-v2-event')
const { validateEvent } = require('./validate-event')
const v1Client = TableClient.fromConnectionString(storageConnectionString, v1Table, { allowInsecureConnection: true })
const paymentClient = TableClient.fromConnectionString(storageConnectionString, paymentTable, { allowInsecureConnection: true })
const batchClient = TableClient.fromConnectionString(storageConnectionString, batchTable, { allowInsecureConnection: true })
const warningClient = TableClient.fromConnectionString(storageConnectionString, warningTable, { allowInsecureConnection: true })

const runMigration = async () => {
  const validEvents = []
  const invalidEvents = []
  const eventResults = v1Client.listEntities()
  for await (const v1Event of eventResults) {
    const v2Event = createV2Event(v1Event)
    if (validateEvent(v2Event)) {
      validEvents.push(v2Event)
    } else {
      invalidEvents.push(v2Event)
    }
  }

  console.log(validEvents)
  console.log(invalidEvents)
}

module.exports = {
  runMigration
}
