const { TableClient } = require('@azure/data-tables')
const { storageConnectionString, v1Table } = require('../config')
const { createV2Event } = require('./create-v2-event')
const { validateEvent } = require('./validate-event')
const { getEventType } = require('./get-event-type')
const { saveEvent } = require('./save-event')
const v1Client = TableClient.fromConnectionString(storageConnectionString, v1Table, { allowInsecureConnection: true })

const runMigration = async () => {
  const validEvents = []
  const invalidEvents = []
  const migratedEvents = []
  const existingEvents = []
  const eventResults = v1Client.listEntities()
  for await (const v1Event of eventResults) {
    const v2Event = await createV2Event(v1Event)
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

  console.log(validEvents)
  console.log(invalidEvents)
  console.log(migratedEvents)
  console.log(existingEvents)
}

module.exports = {
  runMigration
}
