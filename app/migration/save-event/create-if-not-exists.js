const { completeMigration } = require('../../config')
const { PAYMENT_EVENT, WARNING_EVENT, BATCH_EVENT } = require('../../constants/event-types')

const existingEventsCaptured = {
  [PAYMENT_EVENT]: false,
  [WARNING_EVENT]: false,
  [BATCH_EVENT]: false
}

const v2Events = {
  [PAYMENT_EVENT]: [],
  [WARNING_EVENT]: [],
  [BATCH_EVENT]: []
}

const createIfNotExists = async (client, entity, eventType) => {
  if (!existingEventsCaptured[eventType]) {
    console.log(`Capturing existing ${eventType} events`)
    for await (const v2Event of client.listEntities()) {
      v2Events[eventType].push(v2Event)
    }
    existingEventsCaptured[eventType] = true
  }

  let hasExistingEvent = false
  if (eventType === WARNING_EVENT) {
    hasExistingEvent = v2Events[eventType].some(v2Event => v2Event.partitionKey === entity.partitionKey && v2Event.type === entity.type && v2Event.time.toString() === entity.time.toString())
  } else if (eventType === BATCH_EVENT) {
    hasExistingEvent = v2Events[eventType].some(v2Event => v2Event.partitionKey === entity.partitionKey && v2Event.data === entity.data)
  } else {
    hasExistingEvent = v2Events[eventType].some(v2Event => v2Event.partitionKey === entity.partitionKey && v2Event.rowKey.startsWith(removeTimeFromRowKey(entity.rowKey)) && v2Event.type === entity.type && v2Event.data === entity.data)
  }

  if (hasExistingEvent) {
    return false
  }
  if (completeMigration) {
    try {
      await client.createEntity(entity)
    } catch {
      console.log('Unable to save event', entity)
      return false
    }
  }
  return true
}

const removeTimeFromRowKey = (rowKey) => {
  // split row key by pipe and remove the last element and join back together
  const rowKeyArray = rowKey.split('|')
  rowKeyArray.pop()
  return rowKeyArray.join('|')
}

module.exports = {
  createIfNotExists
}
