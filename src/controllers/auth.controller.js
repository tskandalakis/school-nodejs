// user.controller.js
const config = require("../../config");

function handleAuth (username, password) {
  return "test";
}

module.exports = {
  async authenticateUser (req, reply) {
    return reply.response(handleAuth(req.username, req.password)).code(201);
  }
};
