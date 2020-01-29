// src/util/roleFunctions.js

const Boom = require("@hapi/boom");
const Bounce = require("@hapi/bounce");
const authFunctions = require("../util/authFunctions");

async function checkRoles (req, h) {
  try {
    const requiredRoles = req.route.settings.app.roles;
    const user = await authFunctions.getActiveUser(req);

    if (requiredRoles.includes(user.role)) {
      return h.continue;
    } else {
      throw Boom.forbidden("");
    }
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function hasRoles (req, roleArr) {
  try {
    const user = await authFunctions.getActiveUser(req);

    return roleArr.includes(user.role);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function checkSchoolId (req, schoolId) {
  try {
    const user = await authFunctions.getActiveUser(req);
    if (user.role === "super" || user.school_id.toString() === schoolId.toString()) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

module.exports = {
  checkRoles: checkRoles,
  hasRoles: hasRoles,
  checkSchoolId: checkSchoolId
};
