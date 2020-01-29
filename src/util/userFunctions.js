// src/util/userFunctions.js

const Boom = require("@hapi/boom");
const Bounce = require("@hapi/bounce");
const User = require("../model/User");
const { ObjectId } = require("mongoose").Types.ObjectId;

async function verifyUniqueUser (req, h) {
  try {
    const user = await User.findOne({
      email: req.payload.email
    });

    if (user) {
      throw Boom.badRequest("Email already in use.");
    }

    return h.continue;
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function findById (id) {
  if (!ObjectId.isValid(id)) throw Boom.badRequest();
  try {
    return await User.findById({
      _id: new ObjectId(id)
    });
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function findByEmail (email) {
  try {
    return await User.findOne({
      email: email
    });
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser,
  findById: findById,
  findByEmail: findByEmail
};
