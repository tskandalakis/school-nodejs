// server.js
"use strict";

const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");
const glob = require("glob");
const path = require("path");
const config = require("../../config");
const validate = require("../util/authFunctions").validate;

const server = Hapi.server({
  port: config.app_port,
  host: config.app_url
});

server.register(require("hapi-auth-jwt2"), (err) => {
  if (err) {
    throw err;
  }

  server.auth.strategy("jwt", "jwt", true, {
    key: config.secret,
    validate: validate,
    verifyOptions: {
      algorithms: ["HS256"]
    }
  });

  server.auth.default("jwt");

  glob.sync("../routes/*.js", {
    root: __dirname
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    server.route(route);
  });
});

exports.init = async () => {
  await server.initialize();
  return server;
};

exports.start = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  mongoose.connect(config.mongodb, {}, (err) => {
    if (err) {
      throw err;
    }
  });
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
