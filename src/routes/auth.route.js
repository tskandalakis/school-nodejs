// auth.routes.js
const authController = require("../controllers/auth.controller");
const authSchema = require("./requestSchema/auth.schema");
const verifyLogin = require("../util/authFunctions").verifyLogin;

module.exports = [
  {
    path: "/api/auth/login",
    method: "POST",
    handler: authController.login,
    config: {
      pre: [
        { method: verifyLogin, assign: "user" }
      ],
      validate: {
        payload: authSchema.login
      }
    }
  },
  {
    path: "/api/auth/refresh",
    method: "POST",
    handler: authController.login,
    config: {
      validate: {
        payload: authSchema.login
      }
    }
  }
];
