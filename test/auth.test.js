"use strict";

const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const { after, before, describe, it } = exports.lab = Lab.script();
const { init } = require("../src/lib/server");
const User = require("../src/model/User");
const authFunctions = require("../src/util/authFunctions");

describe("AUTH TESTS", () => {
  let server;
  let user;

  before(async () => {
    server = await init();

    const testUser = new User();
    testUser.name = "Test Test";
    testUser.email = "test@test.com";
    testUser.admin = false;
    testUser.password = await authFunctions.hashPassword("testPassword");
    await testUser.save();
    user = testUser;
  });

  it("POST /api/auth/login | responds with 200 and returns object containing token string", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/login",
      payload: {
        email: "test@test.com",
        password: "testPassword"
      }
    });
    expect(res.statusCode).to.equal(201);
    expect(JSON.parse(res.payload).token).to.be.a.string();
  });

  it("POST /api/auth/login | responds with 400 when missing required field", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/login",
      payload: {
        email: "test@test.com"
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it("POST /api/auth/login | responds with 400 when email is wrong/doesn't exist", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/login",
      payload: {
        email: "emaildoesntexist@email.com",
        password: "password"
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it("POST /api/auth/login | responds with 400 when password is wrong", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/login",
      payload: {
        email: "test@test.com",
        password: "wrongPassword"
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  after(async () => {
    await user.delete();
    await server.stop();
  });
});
