const { FRN, CORRELATION_ID, SCHEME_ID, BATCH } = require('../../constants/categories')
const { createRow } = require('./create-row')
const { createIfNotExists } = require('./create-if-not-exists')
const { PAYMENT_EVENT } = require('../../constants/event-types')

const savePaymentEvent = async (client, event) => {
  const frnBasedEntity = createRow(event.data.frn, `${event.data.correlationId}|${event.data.invoiceNumber}`, FRN, event)
  const correlationIdBasedEntity = createRow(event.data.correlationId, `${event.data.frn}|${event.data.invoiceNumber}`, CORRELATION_ID, event)
  const schemeIdBasedEntity = createRow(event.data.schemeId, `${event.data.frn}|${event.data.invoiceNumber}`, SCHEME_ID, event)

  const frnCreated = await createIfNotExists(client, frnBasedEntity, PAYMENT_EVENT)
  const correlationIdCreated = await createIfNotExists(client, correlationIdBasedEntity, PAYMENT_EVENT)
  const schemeIdCreated = await createIfNotExists(client, schemeIdBasedEntity, PAYMENT_EVENT)

  if (event.data.batch) {
    const batchBasedEntity = createRow(event.data.batch, `${event.data.frn}|${event.data.invoiceNumber}`, BATCH, event)
    const batchCreated = await createIfNotExists(client, batchBasedEntity, PAYMENT_EVENT)
    return frnCreated && correlationIdCreated && schemeIdCreated && batchCreated
  }

  return frnCreated && correlationIdCreated && schemeIdCreated
}

module.exports = {
  savePaymentEvent
}
