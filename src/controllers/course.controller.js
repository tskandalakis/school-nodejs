// src/controllers/course.controller.js

const Boom = require("@hapi/boom");
const Bounce = require("@hapi/bounce");
const mongoose = require("mongoose");
const Course = require("../model/Course");
const authFunctions = require("../util/authFunctions");
const courseFunctions = require("../util/courseFunctions");
const roleFunctions = require("../util/roleFunctions");

async function findCourse (req, h) {
  try {
    const activeUser = await authFunctions.getActiveUser(req);
    const course = await courseFunctions.findById(req.params.id);

    if (!course) throw Boom.notFound("Course not found.");
    if (!await roleFunctions.compareSchoolId(activeUser, course)) throw Boom.forbidden();
    if (await roleFunctions.isStudent(activeUser) && !course.students.includes(activeUser._id)) throw Boom.forbidden();

    return h.response(course).code(200);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function findCoursesPaginated (req, h) {
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
      if (req.query.school_id) search.school_id = mongoose.mongo.ObjectId(req.query.school_id);
    }

    if (await roleFunctions.isStudent(activeUser)) {
      search.visible = true;
      search.students = { $in: [activeUser._id] };
    }

    return h.response({
      items: await Course.find(search, {}, {
        sort: "+name",
        limit: size,
        skip: (page - 1) * size
      }),
      count: await Course.countDocuments(search)
    }).code(200);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function createCourse (req, h) {
  try {
    const activeUser = await authFunctions.getActiveUser(req);
    const course = new Course();

    if (!await roleFunctions.isSuper(activeUser) && req.payload.school_id) {
      throw Boom.forbidden();
    } else if (await roleFunctions.isSuper(activeUser)) {
      if (!req.payload.school_id) throw Boom.badRequest();
      course.school_id = req.payload.school_id;
    } else {
      course.school_id = activeUser.school_id;
    }

    course.name = req.payload.name;
    course.title = req.payload.title;
    course.description = req.payload.description;
    course.units = req.payload.units;
    course.visible = req.payload.visible;
    course.startDate = req.payload.startDate;
    course.endDate = req.payload.endDate;
    course.students.push(req.payload.students);

    await course.save();
    return h.response(course).code(201);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function updateCourse (req, h) {
  try {
    const activeUser = await authFunctions.getActiveUser(req);
    const course = await courseFunctions.findById(req.params.id);

    if (!course) throw Boom.notFound("Course not found.");
    if (!await roleFunctions.compareSchoolId(activeUser, course)) throw Boom.forbidden();

    if (req.payload.school_id) {
      if (await roleFunctions.isSuper(activeUser)) {
        course.school_id = req.payload.school_id;
      } else {
        throw Boom.forbidden();
      }
    }

    if (req.payload.name) course.name = req.payload.name;
    if (req.payload.title) course.title = req.payload.title;
    if (req.payload.description) course.description = req.payload.description;
    if (req.payload.units) course.units = req.payload.units;
    if (req.payload.visible) course.visible = req.payload.visible;
    if (req.payload.startDate) course.startDate = req.payload.startDate;
    if (req.payload.endDate) course.endDate = req.payload.endDate;
    if (req.payload.students) course.students = req.payload.students;

    await course.save();

    return h.response(course).code(200);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

module.exports = {
  findCourse: findCourse,
  findCourses: findCoursesPaginated,
  createCourse: createCourse,
  updateCourse: updateCourse
};
