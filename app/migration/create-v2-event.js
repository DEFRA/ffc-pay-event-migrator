const { v4: uuidv4 } = require('uuid')
const eventMap = require('../constants/event-map')
const { mapSubject } = require('./map-subject')
const { mapData } = require('./map-data')

const createV2Event = async (v1Event, v1Client) => {
  const mappedEvent = eventMap[v1Event.EventType]
  return {
    specversion: '1.0',
    type: mappedEvent.v2,
    source: mappedEvent.source,
    id: uuidv4(),
    time: v1Event.EventRaised,
    subject: mapSubject(mappedEvent.v2, v1Event),
    datacontenttype: 'text/json',
    data: await mapData(mappedEvent.v2, v1Event, v1Client)
  }
}

module.exports = {
  createV2Event
}
