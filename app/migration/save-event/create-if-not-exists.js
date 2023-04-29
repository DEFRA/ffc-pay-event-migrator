const { odata } = require('@azure/data-tables')
const { completeMigration } = require('../../config')
const { WARNING } = require('../../constants/categories')

const createIfNotExists = async (client, entity) => {
  let existingEvents
  if (entity.category === WARNING) {
    existingEvents = client.listEntities({ queryOptions: { filter: odata`PartitionKey eq ${entity.partitionKey.toString()} and time eq ${entity.time.toString()}` } })
  } else {
    existingEvents = client.listEntities({ queryOptions: { filter: odata`PartitionKey eq ${entity.partitionKey.toString()} and RowKey eq ${entity.rowKey.toString()}` } })
  }
  let matches = 0
  for await (const _ of existingEvents) { // eslint-disable-line no-unused-vars
    matches++
  }

  if (matches > 0) {
    return false
  }
  if (completeMigration) {
    await client.createEntity(entity)
  }
  return true
}

module.exports = {
  createIfNotExists
}
