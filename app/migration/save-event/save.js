const { PAYMENT_EVENT, WARNING_EVENT, BATCH_EVENT } = require('../../constants/event-types')
const { savePaymentEvent } = require('./payment')
const { saveWarningEvent } = require('./warning')
const { saveBatchEvent } = require('./batch')

const saveEvent = async (event, eventType, batchClient, paymentClient, warningClient) => {
  switch (eventType) {
    case PAYMENT_EVENT:
      return savePaymentEvent(paymentClient, event)
    case WARNING_EVENT:
      return saveWarningEvent(warningClient, event)
    case BATCH_EVENT:
      return saveBatchEvent(batchClient, event)
    default:
      throw new Error(`Unknown event type: ${eventType}`)
  }
}

module.exports = {
  saveEvent
}
