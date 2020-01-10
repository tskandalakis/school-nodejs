const Boom = require("@hapi/boom");
const User = require("../model/User");

async function verifyUniqueUser (req, h) {
  const user = await User.findOne({
    email: req.payload.email
  });

  if (user) {
    throw Boom.badRequest("Email taken");
  }

  return h.continue;
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser
};
