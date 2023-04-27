const { TableClient } = require('@azure/data-tables')
const { WARNING } = require('../../constants/categories')
const { createRow } = require('./create-row')
const { getWarningType } = require('./get-warning-type')
const { storageConnectionString, warningTable } = require('../../config')
const { createIfNotExists } = require('./create-if-not-exists')

const saveWarningEvent = async (event) => {
  const entity = createRow(getWarningType(event.type), event.id, WARNING, event)

  const client = TableClient.fromConnectionString(storageConnectionString, warningTable, { allowInsecureConnection: true })
  return createIfNotExists(client, entity)
}

module.exports = {
  saveWarningEvent
}
