const { TableClient } = require('@azure/data-tables')
const { DefaultAzureCredential } = require('@azure/identity')
const { storageConnectionString, useConnectionString, storageName, v1Table, batchTable, paymentTable, warningTable, textSummary } = require('../config')
const { createV2Event } = require('./create-v2-event')
const { validateEvent } = require('./validate-event')
const { getEventType } = require('./get-event-type')
const { saveEvent } = require('./save-event')
const { createStorage } = require('./create-storage')
const { createSummary } = require('./create-summary')
const { sanitizeV1Event } = require('./sanitize-v1-event')

let v1Client
let batchClient
let paymentClient
let warningClient

if (useConnectionString) {
  console.log('Using connection string')
  v1Client = TableClient.fromConnectionString(storageConnectionString, v1Table, { allowInsecureConnection: true })
  batchClient = TableClient.fromConnectionString(storageConnectionString, batchTable, { allowInsecureConnection: true })
  paymentClient = TableClient.fromConnectionString(storageConnectionString, paymentTable, { allowInsecureConnection: true })
  warningClient = TableClient.fromConnectionString(storageConnectionString, warningTable, { allowInsecureConnection: true })
} else {
  console.log('Using managed identity')
  v1Client = new TableClient(`https://${storageName}.table.core.windows.net`, v1Table, new DefaultAzureCredential())
  paymentClient = new TableClient(`https://${storageName}.table.core.windows.net`, paymentTable, new DefaultAzureCredential())
  warningClient = new TableClient(`https://${storageName}.table.core.windows.net`, warningTable, new DefaultAzureCredential())
  batchClient = new TableClient(`https://${storageName}.table.core.windows.net`, batchTable, new DefaultAzureCredential())
}

const runMigration = async () => {
  const timeStarted = new Date()
  console.log(`Migration started at ${timeStarted.toISOString()}`)
  await createStorage(v1Client, batchClient, paymentClient, warningClient)
  const validEvents = []
  let totalValidEvents = 0
  const invalidEvents = []
  let totalInvalidEvents = 0
  const migratedEvents = []
  let totalMigratedEvents = 0
  const existingEvents = []
  let totalExistingEvents = 0

  console.log('Retrieving all V1 events')
  const eventResults = v1Client.listEntities()

  console.log('Validating V1 events')
  let eventsValidated = 0
  for await (const v1Event of eventResults) {
    if (eventsValidated % 5000 === 0) {
      console.log(`Validated ${eventsValidated} events`)
    }
    const sanitizedV1Event = sanitizeV1Event(v1Event)
    const v2Event = await createV2Event(sanitizedV1Event, v1Client)
    if (validateEvent(v2Event)) {
      validEvents.push(v2Event)
      totalValidEvents++
    } else {
      if (textSummary) {
        invalidEvents.push(v2Event)
      }
      totalInvalidEvents++
    }
    eventsValidated++
  }

  console.log('Migrating valid V1 events to V2 stores')
  let processedEvents = 0
  for (const event of validEvents) {
    if (processedEvents % 5000 === 0) {
      console.log(`Migrated ${processedEvents} events`)
    }
    const eventType = getEventType(event.type)
    const saved = await saveEvent(event, eventType, batchClient, paymentClient, warningClient)
    if (saved) {
      if (textSummary) {
        migratedEvents.push(event)
      }
      totalMigratedEvents++
    } else {
      if (textSummary) {
        existingEvents.push(event)
      }
      totalExistingEvents++
    }
    processedEvents++
  }

  console.log('Creating summary')
  await createSummary(validEvents, invalidEvents, migratedEvents, existingEvents, totalValidEvents, totalInvalidEvents, totalMigratedEvents, totalExistingEvents)

  const timeCompleted = new Date()
  console.log(`Migration completed at ${timeCompleted.toISOString()}`)
  const timeTaken = ((timeCompleted - timeStarted) / 1000) / 60
  console.log(`Duration: ${timeTaken.toFixed(4)} minutes`)
}

module.exports = {
  runMigration
}
