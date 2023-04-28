const { TableClient, odata } = require('@azure/data-tables')
const { storageConnectionString, v1Table } = require('../config')
const { PAYMENT_DAX_REJECTED } = require('../constants/v2-events')
const { sanitizeV1Event } = require('./sanitize-v1-event')

const getPaymentRequest = async (eventType, v1Event) => {
  const v1Client = TableClient.fromConnectionString(storageConnectionString, v1Table, { allowInsecureConnection: true })
  const submissionEvents = []
  let events
  if (eventType === PAYMENT_DAX_REJECTED) {
    events = await v1Client.listEntities({ queryOptions: { filter: odata`Payload contains ${v1Event.properties.action.data.acknowledgement.invoiceNumber} and EventType eq 'payment-request-submission-batch'` } })
  } else {
    events = await v1Client.listEntities({ queryOptions: { filter: odata`PartitionKey eq ${v1Event.PartitionKey} and EventType eq 'payment-request-submission-batch'` } })
  }
  for await (const event of events) {
    const sanitizedV1Event = sanitizeV1Event(event)
    submissionEvents.push(sanitizedV1Event)
  }
  return submissionEvents[0]?.properties.action.data.paymentRequest
}

module.exports = {
  getPaymentRequest
}
