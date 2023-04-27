const { v4: uuidv4 } = require('uuid')
const eventMap = require('../event-map')
const { mapSubject } = require('./map-subject')
const { mapEventData } = require('./map-event-data')

const createV2Event = (event) => {
  const mappedEvent = eventMap[event.EventType]
  return {
    specversion: '1.0',
    type: mappedEvent.v2,
    source: mappedEvent.source,
    id: uuidv4(),
    time: event.EventRaised,
    subject: mapSubject(mappedEvent.v2, event),
    datacontenttype: 'text/json',
    data: mapEventData(mappedEvent.v2, event)
  }
}

module.exports = {
  createV2Event
}
