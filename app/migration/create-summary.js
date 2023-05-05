const path = require('path')
const fs = require('fs/promises')
const { createSummaryContent } = require('./create-summary-content')
const { textSummary } = require('../config')

const createSummary = async (validEvents, invalidEvents, migratedEvents, existingEvents) => {
  if (textSummary) {
    const validEventContent = createSummaryContent(validEvents)
    await fs.writeFile(path.resolve(__dirname, './output/valid-events.txt'), validEventContent)

    const invalidEventContent = createSummaryContent(invalidEvents)
    await fs.writeFile(path.resolve(__dirname, './output/invalid-events.txt'), invalidEventContent)

    const migratedEventContent = createSummaryContent(migratedEvents)
    await fs.writeFile(path.resolve(__dirname, './output/migrated-events.txt'), migratedEventContent)

    const existingEventContent = createSummaryContent(existingEvents)
    await fs.writeFile(path.resolve(__dirname, './output/existing-events.txt'), existingEventContent)
  }

  console.log(`Total events: ${validEvents.length + invalidEvents.length}`)
  console.log(`Valid events: ${validEvents.length}`)
  console.log(`Invalid events: ${invalidEvents.length}`)
  console.log(`Successfully migrated events: ${migratedEvents.length}`)
  console.log(`Events not needing migration: ${existingEvents.length}`)
}

module.exports = {
  createSummary
}
