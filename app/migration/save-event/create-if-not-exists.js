const { odata } = require('@azure/data-tables')
const { completeMigration } = require('../../config')
const { WARNING } = require('../../constants/categories')

const createIfNotExists = async (client, entity) => {
  let existingEvents
  if (entity.category === WARNING) {
    existingEvents = client.listEntities({ queryOptions: { filter: odata`PartitionKey eq ${entity.partitionKey.toString()} and type eq ${entity.type} and time eq ${entity.time.toString()}` } })
  } else {
    existingEvents = client.listEntities({ queryOptions: { filter: odata`PartitionKey eq ${entity.partitionKey.toString()} and RowKey ge ${removeTimeFromRowKey(entity.rowKey).toString()} and type eq ${entity.type} and data eq ${entity.data.toString()}` } })
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

const removeTimeFromRowKey = (rowKey) => {
  // split row key by pipe and remove the last element and join back together
  const rowKeyArray = rowKey.split('|')
  rowKeyArray.pop()
  return rowKeyArray.join('|')
}

module.exports = {
  createIfNotExists
}
