// src/routes/school.routes.js

const schoolController = require("../controllers/school.controller");
const schoolSchema = require("./requestSchema/school.schema");
const roleFunctions = require("../util/roleFunctions");

module.exports = [
  {
    path: "/api/school",
    method: "GET",
    config: {
      app: {
        roles: ["super"]
      },
      pre: [
        { method: roleFunctions.checkRoles }
      ],
      handler: schoolController.findSchools
    }
  },
  {
    path: "/api/school",
    method: "POST",
    config: {
      app: {
        roles: ["super"]
      },
      validate: {
        payload: schoolSchema.createSchool
      },
      pre: [
        { method: roleFunctions.checkRoles }
      ],
      handler: schoolController.createSchool
    }
  },
  {
    path: "/api/school/{id}",
    method: "GET",
    config: {
      app: {
        roles: ["super"]
      },
      pre: [
        { method: roleFunctions.checkRoles }
      ],
      handler: schoolController.findSchool
    }
  },
  {
    path: "/api/school/{id}",
    method: "PUT",
    config: {
      app: {
        roles: ["super"]
      },
      validate: {
        payload: schoolSchema.updateSchool
      },
      pre: [
        { method: roleFunctions.checkRoles }
      ],
      handler: schoolController.updateSchool
    }
  }
];
