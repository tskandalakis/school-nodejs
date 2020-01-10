// user.controller.js
const Boom = require("@hapi/boom");
const User = require("../model/User");
const authFunctions = require("../util/authFunctions");

function findUserById (userId) {
  return { user: "foo" };
}

async function createUser (req, h) {
  const user = new User();
  user.name = req.payload.name;
  user.email = req.payload.email;
  user.admin = false;

  try {
    user.password = await authFunctions.hashPassword(req.payload.password);
    await user.save();

    return h.response("success").code(201);
  } catch (err) {
    throw Boom.badRequest(err);
  }
}

module.exports = {
  findUserById: findUserById,
  createUser: createUser
};
