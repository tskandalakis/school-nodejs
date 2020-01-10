// authFunctions.js
const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const config = require("../../config");

async function hashPassword (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (err) {
    throw Boom.badRequest(err);
  }
}

function createToken (user) {
  let scopes;

  if (user.admin) {
    scopes = "admin";
  }

  return jwt.sign({ id: user._id, email: user.email, name: user.name, scope: scopes }, config.secret, { algorithm: "HS256", expiresIn: "1h" });
}

async function verifyLogin (req, h) {
  try {
    const user = await User.findOne({
      email: req.payload.email
    });

    if (!user) {
      throw new Error();
    }

    const isValid = await bcrypt.compare(req.payload.password, user.password);
    if (isValid) {
      return user;
    } else {
      throw new Error();
    }
  } catch (err) {
    return Boom.badRequest("Email or password are incorrect.");
  }
}

async function validate (decoded, request, h) {
  return { isValid: true };
};

module.exports = {
  hashPassword: hashPassword,
  verifyLogin: verifyLogin,
  createToken: createToken,
  validate: validate
};
