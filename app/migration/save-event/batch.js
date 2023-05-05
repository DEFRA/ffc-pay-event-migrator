const { BATCH } = require('../../constants/categories')
const { getTimestamp } = require('./get-timestamp')
const { createIfNotExists } = require('./create-if-not-exists')
const { BATCH_EVENT } = require('../../constants/event-types')

const saveBatchEvent = async (client, event) => {
  const timestamp = getTimestamp(event.time)
  const entity = {
    partitionKey: event.data.filename,
    rowKey: timestamp.toString(),
    category: BATCH,
    ...event,
    data: JSON.stringify(event.data)
  }

  return createIfNotExists(client, entity, BATCH_EVENT)
}

module.exports = {
  saveBatchEvent
}
