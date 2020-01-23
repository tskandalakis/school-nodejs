// config.js

const config = {
  test: {
    app_url: process.env.APP_URL || "localhost",
    app_port: process.env.PORT || "3001",
    secret: process.env.SECRET || "testKey",
    mongodb: process.env.MONGODB || "mongodb://localhost:27017/testSchool",
    env: process.env.ENV || "test"
  },
  local: {
    app_url: process.env.APP_URL || "localhost",
    app_port: process.env.PORT || "3001",
    secret: process.env.SECRET || "secretKey",
    mongodb: process.env.MONGODB || "mongodb://localhost:27017/school",
    env: process.env.ENV || "local"
  },
  dev: {
    app_url: process.env.APP_URL || "localhost",
    app_port: process.env.PORT || "3001",
    secret: process.env.SECRET || "secretKey",
    mongodb: process.env.MONGODB || "mongodb://localhost:27017/school",
    env: process.env.ENV || "dev"
  },
  prod: {
    app_url: process.env.APP_URL || "localhost",
    app_port: process.env.PORT || "3001",
    secret: process.env.SECRET || "secretKey",
    mongodb: process.env.MONGODB || "mongodb://localhost:27017/school",
    env: process.env.ENV || "dev"
  }
};

module.exports = config;
