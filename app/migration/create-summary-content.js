const createSummaryContent = (events) => {
  let content = ''
  for (const event of events) {
    content += `${JSON.stringify(event)}\n`
  }
  return content
}

module.exports = {
  createSummaryContent
}
