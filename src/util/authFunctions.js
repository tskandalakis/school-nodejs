// authFunctions.js
const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const config = require("../../config");

function hashPassword (password, cb) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return cb(err, null);
    bcrypt.hash(password, salt, (err, hash) => {
      return cb(err, hash);
    });
  });
}

function createToken (user) {
  let scopes;

  if (user.admin) {
    scopes = "admin";
  }

  return jwt.sign({ id: user._id, username: user.username, scope: scopes }, config.secret, { algorithm: "HS256", expiresIn: "1h" });
}

function verifyLogin (req, res) {
  const password = req.payload.password;

  User.findOne({
    $or: [
      { email: req.payload.email }
    ]
  }, (err, user) => {
    if (err) {
      Boom.badRequest(err);
    }
    if (user) {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          Boom.badRequest(err);
        }
        if (isValid) {
          res(user);
        }
        else {
          res(Boom.badRequest("Incorrect credentials!"));
        }
      });
    } else {
      res(Boom.badRequest("Incorrect credentials!"));
    }
  });
}

async function validate (decoded, request, h) {
  User.findOne({
    _id: decoded.id
  }, (err, user) => {
    if (err) {
      Boom.badRequest(err);
    }
    if (!user) {
      return { isValid: false };
    } else {
      return { isValid: true };
    }
  });
};

module.exports = {
  hashPassword: hashPassword,
  verifyLogin: verifyLogin,
  createToken: createToken,
  validate: validate
};
