const { TableClient } = require('@azure/data-tables')
const { storageConnectionString, v1Table, batchTable, paymentTable, warningTable } = require('../config')
const { createV2Event } = require('./create-v2-event')
const { validateEvent } = require('./validate-event')
const { getEventType } = require('./get-event-type')
const { saveEvent } = require('./save-event')
const { createStorage } = require('./create-storage')
const { createSummary } = require('./create-summary')
const { sanitizeV1Event } = require('./sanitize-v1-event')
const v1Client = TableClient.fromConnectionString(storageConnectionString, v1Table, { allowInsecureConnection: true })
const batchClient = TableClient.fromConnectionString(storageConnectionString, batchTable, { allowInsecureConnection: true })
const paymentClient = TableClient.fromConnectionString(storageConnectionString, paymentTable, { allowInsecureConnection: true })
const warningClient = TableClient.fromConnectionString(storageConnectionString, warningTable, { allowInsecureConnection: true })

const runMigration = async () => {
  const timeStarted = new Date()
  console.log(`Migration started at ${timeStarted.toISOString()}`)
  await createStorage()
  const validEvents = []
  const invalidEvents = []
  const migratedEvents = []
  const existingEvents = []

  console.log('Retrieving all V1 events')
  const eventResults = v1Client.listEntities()

  console.log('Validating V1 events')
  for await (const v1Event of eventResults) {
    const sanitizedV1Event = sanitizeV1Event(v1Event)
    const v2Event = await createV2Event(sanitizedV1Event)
    if (validateEvent(v2Event)) {
      validEvents.push(v2Event)
    } else {
      invalidEvents.push(v2Event)
    }
  }

  console.log('Migrating valid V1 events to V2 stores')
  for (const event of validEvents) {
    const eventType = getEventType(event.type)
    const saved = await saveEvent(event, eventType, batchClient, paymentClient, warningClient)
    if (saved) {
      migratedEvents.push(event)
    } else {
      existingEvents.push(event)
    }
  }

  console.log('Creating summary')
  await createSummary(validEvents, invalidEvents, migratedEvents, existingEvents)

  const timeCompleted = new Date()
  console.log(`Migration completed at ${timeCompleted.toISOString()}`)
  const timeTaken = ((timeCompleted - timeStarted) / 1000) / 60
  console.log(`Duration: ${timeTaken.toFixed(4)} minutes`)
}

module.exports = {
  runMigration
}
