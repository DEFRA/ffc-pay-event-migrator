const COMMON_EVENT_PREFIX = 'uk.gov.defra.ffc.pay.'

module.exports = {
  PAYMENT_EVENT_PREFIX: `${COMMON_EVENT_PREFIX}payment.`,
  WARNING_EVENT_PREFIX: `${COMMON_EVENT_PREFIX}warning.`,
  BATCH_EVENT_PREFIX: `${COMMON_EVENT_PREFIX}batch.`
}
