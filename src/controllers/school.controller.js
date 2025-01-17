// src/controllers/school.controller.js

const Boom = require("@hapi/boom");
const Bounce = require("@hapi/bounce");
const School = require("../model/School");
const schoolFunctions = require("../util/schoolFunctions");

async function findSchoolsPaginated (req, h) {
  try {
    let search = {};
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;

    if (req.query.search) {
      search = { name: { $regex: req.query.search, $options: "i" } };
    }

    return h.response({
      items: await School.find(search, {}, {
        sort: "+name",
        limit: size,
        skip: (page - 1) * size
      }),
      count: await School.countDocuments(search)
    }).code(200);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function findSchool (req, h) {
  try {
    const school = await schoolFunctions.findById(req.params.id);
    if (!school) throw Boom.notFound("School not found.");
    return h.response(school).code(200);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function createSchool (req, h) {
  const school = new School();
  school.name = req.payload.name;

  try {
    await school.save();

    return h.response("success").code(201);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function updateSchool (req, h) {
  const school = await schoolFunctions.findById(req.params.id);
  if (!school) throw Boom.notFound("School not found.");
  school.name = req.payload.name;

  try {
    await school.save();

    return h.response("success").code(200);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

module.exports = {
  findSchools: findSchoolsPaginated,
  findSchool: findSchool,
  createSchool: createSchool,
  updateSchool: updateSchool
};
