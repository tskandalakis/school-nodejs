// src/util/roleFunctions.js

const Boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const config = require("../../config")[process.env.NODE_ENV];
const userFunctions = require("../util/userFunctions");

async function isRole (role, token) {
  const decoded = await jwt.verify(token, config.secret, { algorithms: ["HS256"] });
  const user = await userFunctions.findById(decoded._id);

  if (user.role === role) {
    return true;
  } else {
    throw Boom.forbidden("");
  }
}

async function isSuper (req, h) {
  await isRole("super", req.headers.authorization);
  return h.continue;
}

async function isAdmin (req, h) {
  await isRole("admin", req.headers.authorization);
  return h.continue;
}

async function isTeacher (req, h) {
  await isRole("teacher", req.headers.authorization);
  return h.continue;
}

async function isStudent (req, h) {
  await isRole("student", req.headers.authorization);
  return h.continue;
}

module.exports = {
  isSuper: isSuper,
  isAdmin: isAdmin,
  isTeacher: isTeacher,
  isStudent: isStudent
};
