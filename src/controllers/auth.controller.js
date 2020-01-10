const Boom = require("@hapi/boom");
const authFunctions = require("../util/authFunctions");

function login (req, h) {
  try {
    const token = authFunctions.createToken(req.pre.user);
    return h.response({ token: token }).code(201);
  } catch (err) {
    throw Boom.badRequest(err);
  }
}

module.exports = {
  login: login
};
