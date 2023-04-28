const { TableClient } = require('@azure/data-tables')
const { storageConnectionString, paymentTable } = require('../../config')
const { FRN, CORRELATION_ID, SCHEME_ID, BATCH } = require('../../constants/categories')
const { createRow } = require('./create-row')
const { createIfNotExists } = require('./create-if-not-exists')

const savePaymentEvent = async (event) => {
  console.log(event)
  const frnBasedEntity = createRow(event.data.frn, `${event.data.correlationId}|${event.data.invoiceNumber}`, FRN, event)
  const correlationIdBasedEntity = createRow(event.data.correlationId, `${event.data.frn}|${event.data.invoiceNumber}`, CORRELATION_ID, event)
  const schemeIdBasedEntity = createRow(event.data.schemeId, `${event.data.frn}|${event.data.invoiceNumber}`, SCHEME_ID, event)

  const client = TableClient.fromConnectionString(storageConnectionString, paymentTable, { allowInsecureConnection: true })
  const frnCreated = await createIfNotExists(client, frnBasedEntity)
  const correlationIdCreated = await createIfNotExists(client, correlationIdBasedEntity)
  const schemeIdCreated = await createIfNotExists(client, schemeIdBasedEntity)

  if (event.data.batch) {
    const batchBasedEntity = createRow(event.data.batch, `${event.data.frn}|${event.data.invoiceNumber}`, BATCH, event)
    const batchCreated = await createIfNotExists(client, batchBasedEntity)
    return frnCreated && correlationIdCreated && schemeIdCreated && batchCreated
  }

  return frnCreated && correlationIdCreated && schemeIdCreated
}

module.exports = {
  savePaymentEvent
}
