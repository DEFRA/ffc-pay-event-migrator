const { TableClient } = require('@azure/data-tables')
const { BATCH } = require('../../constants/categories')
const { getTimestamp } = require('./get-timestamp')
const { storageConnectionString, batchTable } = require('../../config')

const saveBatchEvent = async (event) => {
  const timestamp = getTimestamp(event.time)
  const batchEntity = {
    partitionKey: event.data.filename,
    rowKey: timestamp.toString(),
    category: BATCH,
    ...event,
    data: JSON.stringify(event.data)
  }

  const client = TableClient.fromConnectionString(storageConnectionString, batchTable, { allowInsecureConnection: true })
  await client.createEntity(batchEntity)

  return true
}

module.exports = {
  saveBatchEvent
}
