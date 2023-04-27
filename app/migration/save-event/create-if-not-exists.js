const { odata } = require('@azure/data-tables')

const createIfNotExists = async (client, entity) => {
  const existingEvents = client.listEntities({ queryOptions: { filter: odata`PartitionKey eq ${entity.partitionKey.toString()} and RowKey eq ${entity.rowKey.toString()}` } })
  let matches = 0
  for await (const _ of existingEvents) { // eslint-disable-line no-unused-vars
    matches++
  }

  if (matches > 0) {
    return false
  }
  await client.createEntity(entity)
  return true
}

module.exports = {
  createIfNotExists
}
