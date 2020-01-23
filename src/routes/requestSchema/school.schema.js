// src/routes/requestSchema/school.schema.js

const Joi = require("@hapi/joi");

module.exports = {
  createSchool: Joi.object({
    name: Joi.string().min(2).required()
  }),
  updateSchool: Joi.object({
    name: Joi.string().min(2).required()
  })
};
