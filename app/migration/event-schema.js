const Joi = require('joi')

module.exports = Joi.object({
  type: Joi.string().required(),
  source: Joi.string().required(),
  subject: Joi.string().optional(),
  data: Joi.object().required()
}).required()
