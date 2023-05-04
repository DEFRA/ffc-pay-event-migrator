const { WARNING } = require('../../constants/categories')
const { createRow } = require('./create-row')
const { getWarningType } = require('./get-warning-type')
const { createIfNotExists } = require('./create-if-not-exists')

const saveWarningEvent = async (client, event) => {
  const entity = createRow(getWarningType(event.type), event.id, WARNING, event)
  return createIfNotExists(client, entity)
}

module.exports = {
  saveWarningEvent
}
