const path = require('path')
const fs = require('fs/promises')
const { createSummaryContent } = require('./create-summary-content')
const { textSummary } = require('../config')

const createSummary = async (validEvents, invalidEvents, migratedEvents, existingEvents, totalValidEvents, totalInvalidEvents, totalMigratedEvents, totalExistingEvents) => {
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

  console.log(`Total events: ${totalValidEvents + totalInvalidEvents}`)
  console.log(`Valid events: ${totalValidEvents}`)
  console.log(`Invalid events: ${totalInvalidEvents}`)
  console.log(`Successfully migrated events: ${totalMigratedEvents}`)
  console.log(`Events not needing migration: ${totalExistingEvents}`)
}

module.exports = {
  createSummary
}
