// src/routes/course.routes.js

const courseController = require("../controllers/course.controller");
const courseSchema = require("./requestSchema/course.schema");
const roleFunctions = require("../util/roleFunctions");

module.exports = [
  {
    path: "/api/course",
    method: "GET",
    config: {
      handler: courseController.findCourses
    }
  },
  {
    path: "/api/course",
    method: "POST",
    config: {
      app: {
        roles: ["super", "admin", "teacher"]
      },
      validate: {
        payload: courseSchema.createCourse
      },
      pre: [
        { method: roleFunctions.checkRoles }
      ],
      handler: courseController.createCourse
    }
  },
  {
    path: "/api/course/{id}",
    method: "GET",
    config: {
      handler: courseController.findCourse
    }
  },
  {
    path: "/api/course/{id}",
    method: "PUT",
    config: {
      app: {
        roles: ["super", "admin", "teacher"]
      },
      validate: {
        payload: courseSchema.updateCourse
      },
      pre: [
        { method: roleFunctions.checkRoles }
      ],
      handler: courseController.updateCourse
    }
  }
];
