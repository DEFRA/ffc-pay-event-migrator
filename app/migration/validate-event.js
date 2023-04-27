const schema = require('./event-schema')

const validateEvent = (v2Event) => {
  const validationResult = schema.validate(v2Event, { allowUnknown: true })
  return !validationResult.error
}

module.exports = {
  validateEvent
}
