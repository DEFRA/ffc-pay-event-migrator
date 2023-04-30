const { TableClient, odata } = require('@azure/data-tables')
const { storageConnectionString, v1Table } = require('../config')
const { PAYMENT_DAX_REJECTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../constants/v2-events')
const { sanitizeV1Event } = require('./sanitize-v1-event')

const sanitizedEvents = []
let haveEvents = false

const getPaymentRequest = async (eventType, v1Event) => {
  if (!haveEvents) {
    await getEvents()
  }
  switch (eventType) {
    case PAYMENT_DAX_REJECTED:
      return sanitizedEvents.find(x => x.properties.action.data.paymentRequest.invoiceNumber === v1Event.properties.action.data.acknowledgement.invoiceNumber)?.properties.action.data.paymentRequest
    case PAYMENT_ACKNOWLEDGED:
      return sanitizedEvents.find(x => x.properties.action.data.paymentRequest.invoiceNumber === v1Event.properties.action.data.invoiceNumber)?.properties.action.data.paymentRequest
    case PAYMENT_SETTLED:
      return sanitizedEvents.find(x =>
        (x.partitionKey === v1Event.partitionKey) ||
        (v1Event.properties.action.data?.returnMessage?.invoiceNumber && v1Event.properties.action.data.returnMessage.invoiceNumber === x.properties.action.data.paymentRequest.invoiceNumber) ||
        (v1Event.properties.action.data?.paymentRequestNumber &&
          v1Event.properties.action.data?.agreementNumber &&
          v1Event.properties.action.data.paymentRequestNumber === x.properties.action.data.paymentRequest.paymentRequestNumber &&
          v1Event.properties.action.data.agreementNumber === x.properties.action.data.paymentRequest.agreementNumber))?.properties.action.data.paymentRequest
    default:
      return undefined
  }
}

const getEvents = async () => {
  const v1Client = TableClient.fromConnectionString(storageConnectionString, v1Table, { allowInsecureConnection: true })
  const events = v1Client.listEntities({ queryOptions: { filter: odata`EventType eq 'payment-request-submission-batch'` } })
  for await (const event of events) {
    const sanitizedV1Event = sanitizeV1Event(event)
    sanitizedEvents.push(sanitizedV1Event)
  }
  haveEvents = true
}

module.exports = {
  getPaymentRequest
}
