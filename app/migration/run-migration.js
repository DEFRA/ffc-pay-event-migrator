const { TableClient } = require('@azure/data-tables')
const { storageConnectionString, v1Table } = require('../config')
const { createV2Event } = require('./create-v2-event')
const { validateEvent } = require('./validate-event')
const { getEventType } = require('./get-event-type')
const { saveEvent } = require('./save-event')
const { createStorage } = require('./create-storage')
const { createSummary } = require('./create-summary')
const { sanitizeV1Event } = require('./sanitize-v1-event')
const v1Client = TableClient.fromConnectionString(storageConnectionString, v1Table, { allowInsecureConnection: true })

const runMigration = async () => {
  console.log(require('../config'))
  const timeStarted = new Date()
  console.log(`Migration started at ${timeStarted.toISOString()}`)
  await createStorage()
  const validEvents = []
  const invalidEvents = []
  const migratedEvents = []
  const existingEvents = []
  const eventResults = v1Client.listEntities()
  for await (const v1Event of eventResults) {
    const sanitizedV1Event = sanitizeV1Event(v1Event)
    const v2Event = await createV2Event(sanitizedV1Event)
    if (validateEvent(v2Event)) {
      validEvents.push(v2Event)
    } else {
      invalidEvents.push(v2Event)
    }
  }

  for (const event of validEvents) {
    const eventType = getEventType(event.type)
    const saved = await saveEvent(event, eventType)
    if (saved) {
      migratedEvents.push(event)
    } else {
      existingEvents.push(event)
    }
  }

  await createSummary(validEvents, invalidEvents, migratedEvents, existingEvents)

  const timeCompleted = new Date()
  console.log(`Migration completed at ${timeCompleted.toISOString()}`)
  const timeTaken = ((timeCompleted - timeStarted) / 1000) / 60
  console.log(`Duration: ${timeTaken.toFixed(4)} minutes`)
}

module.exports = {
  runMigration
}
