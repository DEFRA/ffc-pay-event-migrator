const {
  BATCH_REJECTED,
  PAYMENT_EXTRACTED,
  BATCH_QUARANTINED,
  PAYMENT_SUBMITTED,
  BATCH_CREATED,
  RESPONSE_REJECTED
} = require('../constants/v2-events')

const mapSubject = (eventType, v1Event) => {
  switch (eventType) {
    case BATCH_REJECTED:
      return v1Event.data.filename
    case PAYMENT_EXTRACTED:
      return v1Event.data.filename
    case BATCH_QUARANTINED:
      return v1Event.data.filename
    case PAYMENT_SUBMITTED:
      return v1Event.data.fileName
    case BATCH_CREATED:
      return v1Event.data.filename
    case RESPONSE_REJECTED:
      return v1Event.data.filename
    default:
      return undefined
  }
}

module.exports = {
  mapSubject
}
