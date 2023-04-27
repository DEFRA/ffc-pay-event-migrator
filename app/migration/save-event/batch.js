const { TableClient } = require('@azure/data-tables')
const { BATCH } = require('../../constants/categories')
const { getTimestamp } = require('./get-timestamp')
const { storageConnectionString, batchTable } = require('../../config')
const { createIfNotExists } = require('./create-if-not-exists')

const saveBatchEvent = async (event) => {
  const timestamp = getTimestamp(event.time)
  const entity = {
    partitionKey: event.data.filename,
    rowKey: timestamp.toString(),
    category: BATCH,
    ...event,
    data: JSON.stringify(event.data)
  }

  const client = TableClient.fromConnectionString(storageConnectionString, batchTable, { allowInsecureConnection: true })
  return createIfNotExists(client, entity)
}

module.exports = {
  saveBatchEvent
}
