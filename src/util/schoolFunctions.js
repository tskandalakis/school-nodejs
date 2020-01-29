// src/util/schoolFunctions.js

const Boom = require("@hapi/boom");
const Bounce = require("@hapi/bounce");
const School = require("../model/School");
const { ObjectId } = require("mongoose").Types.ObjectId;

async function findById (id) {
  if (!ObjectId.isValid(id)) throw Boom.badRequest();
  try {
    return await School.findById({
      _id: new ObjectId(id)
    });
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

module.exports = {
  findById: findById
};
