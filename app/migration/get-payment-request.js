const { TableClient, odata } = require('@azure/data-tables')
const { storageConnectionString, v1Table } = require('../config')
const { PAYMENT_DAX_REJECTED, PAYMENT_ACKNOWLEDGED } = require('../constants/v2-events')
const { sanitizeV1Event } = require('./sanitize-v1-event')

const getPaymentRequest = async (eventType, v1Event) => {
  const v1Client = TableClient.fromConnectionString(storageConnectionString, v1Table, { allowInsecureConnection: true })
  const submissionEvents = []
  let events
  if (eventType === PAYMENT_DAX_REJECTED || eventType === PAYMENT_ACKNOWLEDGED) {
    events = await v1Client.listEntities({ queryOptions: { filter: odata`EventType eq 'payment-request-submission-batch'` } })
    for await (const event of events) {
      if (event.Payload.includes(v1Event.properties.action.data.acknowledgement.invoiceNumber)) {
        const sanitizedV1Event = sanitizeV1Event(event)
        submissionEvents.push(sanitizedV1Event)
      }
    }
  } else {
    events = await v1Client.listEntities({ queryOptions: { filter: odata`PartitionKey eq ${v1Event.partitionKey} and EventType eq 'payment-request-submission-batch'` } })
    for await (const event of events) {
      const sanitizedV1Event = sanitizeV1Event(event)
      submissionEvents.push(sanitizedV1Event)
    }
  }
  return submissionEvents[0]?.properties.action.data.paymentRequest
}

module.exports = {
  getPaymentRequest
}
