const { createTables } = require('../config')

const createStorage = async (v1Client, batchClient, paymentClient, warningClient) => {
  if (createTables) {
    await v1Client.createTable()
    await batchClient.createTable()
    await paymentClient.createTable()
    await warningClient.createTable()
  }
}

module.exports = {
  createStorage
}
