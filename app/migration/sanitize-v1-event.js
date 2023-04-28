const sanitizeV1Event = (v1Event) => {
  return {
    ...v1Event,
    properties: {
      action: JSON.parse(v1Event.Payload)
    }
  }
}

module.exports = {
  sanitizeV1Event
}
