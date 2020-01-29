// src/routes/requestSchema/user.schema.js

const Joi = require("@hapi/joi");

module.exports = {
  createUser: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    school_id: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required()
  }),
  updateUser: Joi.object({
    name: Joi.string().min(2).max(30),
    school_id: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    role: Joi.string()
  })
};
