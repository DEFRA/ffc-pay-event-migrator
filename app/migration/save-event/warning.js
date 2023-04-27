const { TableClient } = require('@azure/data-tables')
const { WARNING } = require('../../constants/categories')
const { createRow } = require('./create-row')
const { getWarningType } = require('./get-warning-type')
const { storageConnectionString, warningTable } = require('../../config')

const saveWarningEvent = async (event) => {
  const entity = createRow(getWarningType(event.type), event.id, WARNING, event)

  const client = TableClient.fromConnectionString(storageConnectionString, warningTable, { allowInsecureConnection: true })
  await client.createEntity(entity)

  return true
}

module.exports = {
  saveWarningEvent
}
