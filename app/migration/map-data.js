const {
  BATCH_REJECTED,
  PAYMENT_EXTRACTED,
  BATCH_QUARANTINED,
  BATCH_PROCESSED,
  PAYMENT_REJECTED,
  PAYMENT_ENRICHED,
  PAYMENT_DAX_REJECTED,
  PAYMENT_INVALID_BANK,
  PAYMENT_PROCESSING_FAILED,
  PAYMENT_PROCESSED,
  PAYMENT_SETTLED,
  PAYMENT_SETTLEMENT_UNMATCHED,
  PAYMENT_PAUSED_LEDGER,
  PAYMENT_PAUSED_DEBT,
  PAYMENT_SUBMITTED,
  BATCH_CREATED,
  RESPONSE_REJECTED,
  PAYMENT_REQUEST_BLOCKED,
  PAYMENT_REQUEST_ENRICHED,
  PAYMENT_QUALITY_CHECK_PASSED
} = require('../constants/v2-events')

const schemeIds = require('../constants/scheme-ids')
const { getPaymentRequest } = require('./get-payment-request')

const mapData = async (eventType, v1Event) => {
  switch (eventType) {
    case BATCH_REJECTED:
    case RESPONSE_REJECTED:
      return {
        filename: v1Event.properties.action.data.filename,
        message: v1Event.properties.action.message
      }
    case PAYMENT_EXTRACTED:
      return {
        schemeId: schemeIds[v1Event.properties.action.data.paymentRequest.sourceSystem],
        ...v1Event.properties.action.data.paymentRequest
      }
    case BATCH_QUARANTINED:
      return {
        message: 'Batch quarantined',
        filename: v1Event.properties.action.data.filename
      }
    case BATCH_PROCESSED:
    case BATCH_CREATED:
      return {
        filename: v1Event.properties.action.data.filename
      }
    case PAYMENT_REJECTED:
    case PAYMENT_PROCESSING_FAILED:
      return {
        message: v1Event.properties.action.message,
        ...v1Event.properties.action.data.paymentRequest
      }
    case PAYMENT_ENRICHED:
      return {
        ...v1Event.data.paymentRequest
      }
    case PAYMENT_DAX_REJECTED:
      return {
        message: 'Payment request rejected by DAX',
        ...await getPaymentRequest(PAYMENT_DAX_REJECTED, v1Event),
        ...v1Event.properties.action.data.acknowledgement
      }
    case PAYMENT_INVALID_BANK:
      return {
        message: 'No valid bank details held',
        frn: v1Event.properties.action.data.frn
      }
    case PAYMENT_PROCESSED:
    case PAYMENT_PAUSED_LEDGER:
    case PAYMENT_PAUSED_DEBT:
      return {
        ...v1Event.properties.action.data
      }
    case PAYMENT_SETTLED:
      return {
        ...await getPaymentRequest(PAYMENT_SETTLED, v1Event)
      }
    case PAYMENT_SETTLEMENT_UNMATCHED:
      return {
        message: `Unable to find payment request for settlement, Invoice: ${v1Event.properties.action.data.invoiceNumber}, FRN: ${v1Event.properties.action.data.frn}`,
        frn: v1Event.properties.action.data.frn,
        invoiceNumber: v1Event.properties.action.data.invoiceNumber
      }
    case PAYMENT_SUBMITTED:
      return {
        ...v1Event.properties.action.data.paymentRequest
      }
    case PAYMENT_REQUEST_BLOCKED:
      return {
        message: 'Payment request does not have debt data to attach',
        ...v1Event.properties.action.data.paymentRequest
      }
    case PAYMENT_REQUEST_ENRICHED:
      return {
        attachedBy: v1Event.properties.action.data.user,
        ...v1Event.properties.action.data.paymentRequest
      }
    case PAYMENT_QUALITY_CHECK_PASSED:
    default:
      return undefined
  }
}

module.exports = {
  mapData
}
