const {
  PAYMENT_ENRICHMENT_V1,
  PAYMENT_PROCESSED_V1,
  PAYMENT_SUBMITTED_BATCH_V1,
  PAYMENT_SUBMITTED_V1,
  BATCH_PROCESSED_V1,
  BATCH_PROCESSING_ERROR_V1,
  PAYMENT_SETTLED_V1,
  PAYMENT_ACKNOWLEDGED_V1,
  PAYMENT_REJECTED_V1,
  PAYMENT_INVALID_BANK_DETAILS_V1,
  PAYMENT_PAUSED_DEBT_ENRICHMENT_V1,
  PAYMENT_BLOCKED_V1,
  PAYMENT_ENRICHED_V1,
  PAYMENT_DEBT_ENRICHED_V1,
  PAYMENT_PAUSED_LEDGER_V1,
  PAYMENT_LEDGER_QUALITY_CHECK_REVIEWED_V1,
  PAYMENT_LEDGER_QUALITY_CHECKED_V1,
  PAYMENT_LEDGER_QUALITY_CHECK_PASSED_V1,
  BATCH_QUARANTINED_V1,
  BATCH_PAYMENT_ERROR_V1,
  PAYMENT_DAX_REJECTED_V1,
  PAYMENT_PROCESSING_ERROR_V1,
  RESPONSE_REJECTED_V1
} = require('./v1-events')

const {
  PAYMENT_EXTRACTED,
  PAYMENT_ENRICHED,
  PAYMENT_PAUSED_DEBT,
  PAYMENT_DEBT_ATTACHED,
  PAYMENT_PAUSED_LEDGER,
  PAYMENT_LEDGER_ASSIGNED,
  PAYMENT_PAUSED_QUALITY_CHECK,
  PAYMENT_QUALITY_CHECK_PASSED,
  PAYMENT_PROCESSED,
  PAYMENT_SUBMITTED,
  PAYMENT_ACKNOWLEDGED,
  PAYMENT_SETTLED,
  BATCH_REJECTED,
  PAYMENT_REJECTED,
  PAYMENT_INVALID_BANK,
  PAYMENT_PROCESSING_FAILED,
  BATCH_CREATED,
  RESPONSE_REJECTED,
  PAYMENT_REQUEST_BLOCKED,
  PAYMENT_REQUEST_ENRICHED
} = require('./v2-events')

module.exports = {
  [PAYMENT_ENRICHMENT_V1]: { v2: PAYMENT_ENRICHED, source: 'ffc-pay-enrichment' },
  [PAYMENT_PROCESSED_V1]: { v2: PAYMENT_PROCESSED, source: 'ffc-pay-processing' },
  [PAYMENT_SUBMITTED_BATCH_V1]: { v2: PAYMENT_SUBMITTED, source: 'ffc-pay-submission' },
  [PAYMENT_SUBMITTED_V1]: { v2: BATCH_CREATED, source: 'ffc-pay-submission' },
  [PAYMENT_SETTLED_V1]: { v2: PAYMENT_SETTLED, source: 'ffc-pay-processing' },
  [PAYMENT_ACKNOWLEDGED_V1]: { v2: PAYMENT_ACKNOWLEDGED, source: 'ffc-pay-processing' },
  [PAYMENT_REJECTED_V1]: { v2: PAYMENT_REJECTED, source: 'ffc-pay-enrichment' },
  [PAYMENT_INVALID_BANK_DETAILS_V1]: { v2: PAYMENT_INVALID_BANK, source: 'ffc-pay-processing' },
  [PAYMENT_PAUSED_DEBT_ENRICHMENT_V1]: { v2: PAYMENT_PAUSED_DEBT, source: 'ffc-pay-processing' },
  [PAYMENT_BLOCKED_V1]: { v2: PAYMENT_REQUEST_BLOCKED, source: 'ffc-pay-request-editor' },
  [PAYMENT_ENRICHED_V1]: { v2: PAYMENT_REQUEST_ENRICHED, source: 'ffc-pay-request-editor' },
  [PAYMENT_DEBT_ENRICHED_V1]: { v2: PAYMENT_DEBT_ATTACHED, source: 'ffc-pay-request-editor' },
  [PAYMENT_PAUSED_LEDGER_V1]: { v2: PAYMENT_PAUSED_LEDGER, source: 'ffc-pay-processing' },
  [PAYMENT_LEDGER_QUALITY_CHECK_REVIEWED_V1]: { v2: PAYMENT_LEDGER_ASSIGNED, source: 'ffc-pay-request-editor' },
  [PAYMENT_LEDGER_QUALITY_CHECKED_V1]: { v2: PAYMENT_PAUSED_QUALITY_CHECK, source: 'ffc-pay-request-editor' },
  [PAYMENT_LEDGER_QUALITY_CHECK_PASSED_V1]: { v2: PAYMENT_QUALITY_CHECK_PASSED, source: 'ffc-pay-request-editor' },
  [BATCH_PROCESSED_V1]: { v2: PAYMENT_EXTRACTED, source: 'ffc-pay-batch-processor' },
  [BATCH_PROCESSING_ERROR_V1]: { v2: BATCH_REJECTED, source: 'ffc-pay-batch-processor' },
  [BATCH_QUARANTINED_V1]: { v2: BATCH_QUARANTINED_V1, source: 'ffc-pay-batch-processor' },
  [BATCH_PAYMENT_ERROR_V1]: { v2: PAYMENT_REJECTED, source: 'ffc-pay-batch-processor' },
  [PAYMENT_DAX_REJECTED_V1]: { v2: PAYMENT_REJECTED, source: 'ffc-pay-processing' },
  [PAYMENT_PROCESSING_ERROR_V1]: { v2: PAYMENT_PROCESSING_FAILED, source: 'ffc-pay-processing' },
  [RESPONSE_REJECTED_V1]: { v2: RESPONSE_REJECTED, source: 'ffc-pay-responses' }
}
