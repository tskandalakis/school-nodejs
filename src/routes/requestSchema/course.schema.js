// src/routes/requestSchema/course.schema.js

const Joi = require("@hapi/joi");

module.exports = {
  createCourse: Joi.object({
    school_id: Joi.string(),
    name: Joi.string().min(2).max(30).required(),
    title: Joi.string().min(2).max(30).required(),
    description: Joi.string().required(),
    units: Joi.number().required(),
    visible: Joi.boolean().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    students: Joi.array().required()
  }),
  updateCourse: Joi.object({
    school_id: Joi.string(),
    name: Joi.string().min(2).max(30),
    title: Joi.string().min(2).max(30),
    description: Joi.string(),
    units: Joi.number(),
    visible: Joi.boolean(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    students: Joi.array()
  })
};
