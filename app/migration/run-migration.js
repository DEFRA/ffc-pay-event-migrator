const { v4: uuidv4 } = require('uuid')
const { TableClient } = require('@azure/data-tables')
const { storageConnectionString, v1Table, paymentTable, batchTable, warningTable } = require('../config')
const v1Client = TableClient.fromConnectionString(storageConnectionString, v1Table, { allowInsecureConnection: true })
const paymentClient = TableClient.fromConnectionString(storageConnectionString, paymentTable, { allowInsecureConnection: true })
const batchClient = TableClient.fromConnectionString(storageConnectionString, batchTable, { allowInsecureConnection: true })
const warningClient = TableClient.fromConnectionString(storageConnectionString, warningTable, { allowInsecureConnection: true })
const eventMap = require('../constants/event-map')

const runMigration = async () => {
  const events = []
  const eventResults = v1Client.listEntities()
  for await (const event of eventResults) {
    const newEvent = createNewEvent(event)
    events.push(newEvent)
  }

  console.log([...new Set(events)])
}

const createNewEvent = (event) => {
  const mappedEvent = eventMap[event.EventType]
  return {
    specversion: '1.0',
    type: mappedEvent.v2,
    source: mappedEvent.source,
    id: uuidv4(),
    time: event.EventRaised,
    subject: 'TBC',
    datacontenttype: 'text/json',
    data: {}
  }
}

module.exports = {
  runMigration
}
