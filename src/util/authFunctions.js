// src/util/authFunctions.js

const Boom = require("@hapi/boom");
const Bounce = require("@hapi/bounce");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userFunctions = require("./userFunctions");
const config = require("../../config")[process.env.NODE_ENV];

async function hashPassword (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

function createAccessToken (user) {
  try {
    return jwt.sign({ _id: user._id }, config.secret, { algorithm: "HS256", expiresIn: "1h" });
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function refreshAccessToken (refreshToken) {
  try {
    let decoded;

    try {
      decoded = await jwt.verify(refreshToken, config.secret, { algorithms: ["HS256"] });
    } catch (err) {
      throw Boom.unauthorized("Refresh Token Invalid.");
    }

    return createAccessToken(await userFunctions.findById(decoded._id));
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

function createRefreshToken (user) {
  try {
    return jwt.sign({ _id: user._id }, config.secret, { algorithm: "HS256", expiresIn: "24h" });
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function verifyLogin (req, h) {
  try {
    const user = await userFunctions.findByEmail(req.payload.email);

    if (!user) {
      throw Boom.badRequest("Email or password are incorrect.");
    }

    if (await bcrypt.compare(req.payload.password, user.password)) {
      return user;
    } else {
      throw Boom.badRequest("Email or password are incorrect.");
    }
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function getActiveUser (req) {
  try {
    const decoded = await jwt.verify(req.headers.authorization, config.secret, { algorithms: ["HS256"] });
    return await userFunctions.findById(decoded._id);
  } catch (err) {
    /* $lab:coverage:off$ */
    if (err.isBoom) Bounce.rethrow(err, "boom");
    else throw Boom.badImplementation(err);
    /* $lab:coverage:on$ */
  }
}

async function validate (decoded, request, h) {
  return { isValid: true };
};

module.exports = {
  hashPassword: hashPassword,
  verifyLogin: verifyLogin,
  createAccessToken: createAccessToken,
  refreshAccessToken: refreshAccessToken,
  createRefreshToken: createRefreshToken,
  getActiveUser: getActiveUser,
  validate: validate
};
