// src/util/schoolFunctions.js

const Boom = require("@hapi/boom");
const School = require("../model/School");
const { ObjectId } = require("mongoose").Types.ObjectId;

async function findById (id) {
  if (!ObjectId.isValid(id)) throw Boom.notFound();
  try {
    return await School.findById({
      _id: new ObjectId(id)
    });
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation();
  }
}

module.exports = {
  findById: findById
};
