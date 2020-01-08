const Boom = require("@hapi/boom");
const User = require("../model/User");

function verifyUniqueUser (req, res) {
  User.findOne({
    email: req.payload.email
  }, (err, user) => {
    if (err) res(Boom.badRequest("Error, Please try again later."));
    if (user) {
      if (user.email === req.payload.email) {
        res(Boom.badRequest("Email taken"));
      }
    }
    res(req.payload);
  });
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser
};
