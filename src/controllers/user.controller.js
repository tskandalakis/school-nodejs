// src/controllers/user.controller.js

const Boom = require("@hapi/boom");
const Bounce = require("@hapi/bounce");
const User = require("../model/User");
const authFunctions = require("../util/authFunctions");
const userFunctions = require("../util/userFunctions");
const roleFunctions = require("../util/roleFunctions");

async function findUsersPaginated (req, h) {
  try {
    const activeUser = await authFunctions.getActiveUser(req);

    const search = {};
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;

    if (req.query.search) {
      search.name = { $regex: req.query.search, $options: "i" };
    }

    if (!await roleFunctions.isSuper(activeUser)) {
      search.school_id = activeUser.school_id;
    } else {
      if (req.query.school_id) search.school_id = req.query.school_id;
    }

    return h.response({
      items: await User.find(search, "-password", {
        sort: "+name",
        limit: size,
        skip: (page - 1) * size
      }),
      count: await User.countDocuments(search)
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
    const activeUser = await authFunctions.getActiveUser(req);
    const user = await userFunctions.findById(req.params.id);

    if (!user) throw Boom.notFound("User not found.");
    if (!await roleFunctions.compareSchoolId(activeUser, user)) throw Boom.forbidden();

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
    const activeUser = await authFunctions.getActiveUser(req);
    const user = new User();

    if (!await roleFunctions.isSuper(activeUser) && req.payload.school_id) {
      throw Boom.forbidden();
    } else if (await roleFunctions.isSuper(activeUser) && req.payload.school_id) {
      user.school_id = req.payload.school_id;
    } else {
      user.school_id = activeUser.school_id;
    }

    if (!await roleFunctions.isSuper(activeUser) && req.payload.role === "super") {
      throw Boom.forbidden();
    } else {
      user.role = req.payload.role;
    }

    user.name = req.payload.name;
    user.email = req.payload.email;
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
  try {
    const activeUser = await authFunctions.getActiveUser(req);
    const user = await userFunctions.findById(req.params.id);

    if (!user) throw Boom.notFound("User not found.");

    if (!await roleFunctions.compareSchoolId(activeUser, user)) throw Boom.forbidden();
    if (!await roleFunctions.isSuper(activeUser) && req.payload.school_id) throw Boom.forbidden();
    if (!await roleFunctions.isSuper(activeUser) && req.payload.role === "super") throw Boom.forbidden();

    if (req.payload.name) user.name = req.payload.name;
    if (req.payload.email) user.email = req.payload.email;
    if (req.payload.password) user.password = await authFunctions.hashPassword(req.payload.password);
    if (req.payload.role) user.role = req.payload.role;
    if (req.payload.school_id) user.school_id = req.payload.school_id;

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
