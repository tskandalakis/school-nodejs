// src/controllers/auth.controller.js

const Bounce = require("@hapi/bounce");
const Boom = require("@hapi/boom");
const authFunctions = require("../util/authFunctions");

async function login (req, h) {
  try {
    return h.response({
      access_token: await authFunctions.createAccessToken(req.pre.user),
      refresh_token: await authFunctions.createRefreshToken(req.pre.user)
    }).code(201);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function refresh (req, h) {
  try {
    return h.response({
      access_token: await authFunctions.refreshAccessToken(req.payload.refresh_token)
    }).code(201);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

module.exports = {
  login: login,
  refresh: refresh
};
