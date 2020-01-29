// src/routes/user.routes.js

const userController = require("../controllers/user.controller");
const userSchema = require("./requestSchema/user.schema");
const userFunctions = require("../util/userFunctions");
const roleFunctions = require("../util/roleFunctions");

module.exports = [
  {
    path: "/api/user",
    method: "GET",
    config: {
      handler: userController.findUsers
    }
  },
  {
    path: "/api/user",
    method: "POST",
    config: {
      app: {
        roles: ["super", "admin"]
      },
      validate: {
        payload: userSchema.createUser
      },
      pre: [
        { method: roleFunctions.checkRoles },
        { method: userFunctions.verifyUniqueUser }
      ],
      handler: userController.createUser
    }
  },
  {
    path: "/api/user/{id}",
    method: "GET",
    config: {
      handler: userController.findUser
    }
  },
  {
    path: "/api/user/{id}",
    method: "PUT",
    config: {
      app: {
        roles: ["super", "admin"]
      },
      validate: {
        payload: userSchema.updateUser
      },
      pre: [
        { method: roleFunctions.checkRoles },
        { method: userFunctions.verifyUniqueUser }
      ],
      handler: userController.updateUser
    }
  }
];
