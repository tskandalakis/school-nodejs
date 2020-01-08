// user.controller.js
const Boom = require("@hapi/boom");
const User = require("../model/User");
const authFunctions = require("../util/authFunctions");

function findUserById (userId) {
  return { user: "foo" };
}

function createUser (req, res) {
  const user = new User();
  user.name = req.payload.name;
  user.email = req.payload.email;
  user.admin = false;
  authFunctions.hashPassword(req.payload.password, (err, hash) => {
    if (err) {
      throw Boom.badRequest(err);
    }
    user.password = hash;
    user.save((err, user) => {
      if (err) throw Boom.badRequest(err);
      res({ token: authFunctions.createToken(user) }).code(201);
    });
  });
}

module.exports = {
  findUserById: findUserById,
  createUser: createUser
};
