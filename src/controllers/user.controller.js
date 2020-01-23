// src/controllers/user.controller.js

const Boom = require("@hapi/boom");
const User = require("../model/User");
const authFunctions = require("../util/authFunctions");
const userFunctions = require("../util/userFunctions");

async function findUser (req, h) {
  try {
    const user = await userFunctions.findByIdSafe(req.params.id);
    if (!user) throw Boom.notFound("User not found.");
    return h.response(user).code(200);
  } catch (err) {
    if (err.isBoom) return err;
    else return Boom.badRequest(err);
  }
}

async function createUser (req, h) {
  const user = new User();
  user.school_id = req.payload.school_id;
  user.name = req.payload.name;
  user.email = req.payload.email;
  user.role = req.role;

  try {
    user.password = await authFunctions.hashPassword(req.payload.password);
    await user.save();

    return h.response("success").code(201);
  } catch (err) {
    if (err.isBoom) return err;
    else return Boom.badRequest(err);
  }
}

module.exports = {
  findUser: findUser,
  createUser: createUser
};
