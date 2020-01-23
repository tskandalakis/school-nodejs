// src/routes/school.routes.js

const schoolController = require("../controllers/school.controller");
const schoolSchema = require("./requestSchema/school.schema");
const roleFunctions = require("../util/roleFunctions");

module.exports = [
  {
    path: "/api/school",
    method: "GET",
    config: {
      pre: [
        { method: roleFunctions.isSuper }
      ],
      handler: schoolController.findSchools
    }
  },
  {
    path: "/api/school",
    method: "POST",
    config: {
      validate: {
        payload: schoolSchema.createSchool
      },
      pre: [
        { method: roleFunctions.isSuper }
      ],
      handler: schoolController.createSchool
    }
  },
  {
    path: "/api/school/{id}",
    method: "GET",
    config: {
      pre: [
        { method: roleFunctions.isSuper }
      ],
      handler: schoolController.findSchool
    }
  },
  {
    path: "/api/school/{id}",
    method: "PUT",
    config: {
      validate: {
        payload: schoolSchema.updateSchool
      },
      pre: [
        { method: roleFunctions.isSuper }
      ],
      handler: schoolController.updateSchool
    }
  }
];
