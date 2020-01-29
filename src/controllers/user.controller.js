// src/controllers/user.controller.js

const Boom = require("@hapi/boom");
const Bounce = require("@hapi/bounce");
const User = require("../model/User");
const authFunctions = require("../util/authFunctions");
const userFunctions = require("../util/userFunctions");
const roleFunctions = require("../util/roleFunctions");

async function findUsersPaginated (req, h) {
  try {
    const search = {};
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;

    if (req.query.search) {
      search.name = { $regex: req.query.search, $options: "i" };
    }

    if (!await roleFunctions.hasRoles(req, ["super"])) {
      search.school_id = await authFunctions.getActiveUser(req).school_id;
    }

    return h.response({
      items: await User.find(search, "-password", {
        sort: "+name",
        limit: size,
        skip: (page - 1) * size
      }),
      count: await User.countDocuments()
    }).code(200);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function findUser (req, h) {
  try {
    const user = await userFunctions.findById(req.params.id);

    if (!user) throw Boom.notFound("User not found.");

    if (!await roleFunctions.checkSchoolId(req, user.school_id)) throw Boom.forbidden();

    delete user.password;

    return h.response(user).code(200);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function createUser (req, h) {
  try {
    const hasSuper = await roleFunctions.hasRoles(req, ["super"]);
    const user = new User();
    user.school_id = req.payload.school_id;
    user.name = req.payload.name;
    user.email = req.payload.email;

    if (req.payload.role === "super" && !hasSuper) {
      throw Boom.forbidden();
    } else {
      user.role = req.payload.role;
    }

    if (!hasSuper && req.payload.school_id) {
      throw Boom.forbidden();
    } else if (hasSuper && req.payload.school_id) {
      user.school_id = req.payload.school_id;
    } else {
      user.school_id = await authFunctions.getActiveUser(req).school_id;
    }

    user.password = await authFunctions.hashPassword(req.payload.password);
    await user.save();

    delete user.password;
    return h.response(user).code(201);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function updateUser (req, h) {
  const hasSuper = await roleFunctions.hasRoles(req, ["super"]);
  const activeUser = await authFunctions.getActiveUser(req);
  const user = await userFunctions.findById(req.params.id);

  if (!user) throw Boom.notFound("User not found.");

  if (!hasSuper) {
    if (req.payload.role === "super") throw Boom.forbidden();
    if (req.payload.school_id) throw Boom.forbidden();
    if (activeUser.school_id.toString() !== user.school_id.toString()) throw Boom.forbidden();
  }

  if (req.payload.name) user.name = req.payload.name;
  if (req.payload.email) user.email = req.payload.email;
  if (req.payload.password) user.password = await authFunctions.hashPassword(req.payload.password);
  if (req.payload.role) user.role = req.payload.role;
  if (req.payload.school_id) user.school_id = req.payload.school_id;

  try {
    await user.save();

    delete user.password;
    return h.response(user).code(200);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

module.exports = {
  findUser: findUser,
  findUsers: findUsersPaginated,
  createUser: createUser,
  updateUser: updateUser
};
