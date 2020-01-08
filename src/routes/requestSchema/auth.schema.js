// auth.schema.js
const Joi = require("@hapi/joi");

module.exports = {
  login: Joi.object({
    username: Joi.string()
      .alphanum()
      .required(),
    password: Joi.string()
      .required()
  })
};
