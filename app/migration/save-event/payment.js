const { TableClient } = require('@azure/data-tables')
const { storageConnectionString, paymentTable } = require('../../config')
const { FRN, CORRELATION_ID, SCHEME_ID, BATCH } = require('../../constants/categories')
const { createRow } = require('./create-row')

const savePaymentEvent = async (event) => {
  const frnBasedEntity = createRow(event.data.frn, `${event.data.correlationId}|${event.data.invoiceNumber}`, FRN, event)
  const correlationIdBasedEntity = createRow(event.data.correlationId, `${event.data.frn}|${event.data.invoiceNumber}`, CORRELATION_ID, event)
  const schemeIdBasedEntity = createRow(event.data.schemeId, `${event.data.frn}|${event.data.invoiceNumber}`, SCHEME_ID, event)

  const client = TableClient.fromConnectionString(storageConnectionString, paymentTable, { allowInsecureConnection: true })
  await client.createEntity(frnBasedEntity)
  await client.createEntity(correlationIdBasedEntity)
  await client.createEntity(schemeIdBasedEntity)

  if (event.data.batch) {
    const batchBasedEntity = createRow(event.data.batch, `${event.data.frn}|${event.data.invoiceNumber}`, BATCH, event)
    await client.createEntity(batchBasedEntity)
  }

  return true
}

module.exports = {
  savePaymentEvent
}
