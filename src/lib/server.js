// src/lib/server.js

"use strict";

const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");
const config = require("../../config")[process.env.NODE_ENV];
const validate = require("../util/authFunctions").validate;

const server = Hapi.server({
  port: config.app_port,
  host: config.app_url,
  routes: { cors: true }
});

let initialized = false;

exports.init = async () => {
  if (initialized) return server;

  await server.initialize();
  await server.register([require("hapi-auth-jwt2")]);

  server.auth.strategy("jwt", "jwt", {
    key: config.secret,
    validate: validate,
    verifyOptions: {
      algorithms: ["HS256"]
    }
  });

  server.auth.default("jwt");

  // Register Routes
  server.route(require("../routes/user.route"));
  server.route(require("../routes/auth.route"));
  server.route(require("../routes/school.route"));

  mongoose.set("useCreateIndex", true);
  mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
      throw err;
    }
  });

  initialized = true;

  return server;
};

exports.start = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
