// test/auth/login.test.js

const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const Dummy = require("mongoose-dummy");
const { after, before, describe, it } = exports.lab = Lab.script();
const { init } = require("../../src/lib/server");
const User = require("../../src/model/User");
const authFunctions = require("../../src/util/authFunctions");

describe("AUTH | LOGIN | POST /api/auth/login", () => {
  let server;
  let normalUser;
  let normalUserPasswordPlainText;

  before(async () => {
    server = await init();

    normalUser = new User(await Dummy(User));
    normalUser.role = "student";
    normalUserPasswordPlainText = normalUser.password;
    normalUser.password = await authFunctions.hashPassword(normalUser.password);
    normalUser = await normalUser.save();
  });

  it("responds with 201 and returns object containing access_token and refresh_token strings", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/login",
      payload: {
        email: normalUser.email,
        password: normalUserPasswordPlainText
      }
    });

    expect(res.statusCode).to.equal(201);
    expect(JSON.parse(res.payload).access_token).to.be.a.string();
    expect(JSON.parse(res.payload).refresh_token).to.be.a.string();
  });

  it("responds with 400 when missing required field", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/login",
      payload: {
        email: "test@test.com"
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it("responds with 400 when email is wrong/doesn't exist", async () => {
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

  it("responds with 400 when password is wrong", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/login",
      payload: {
        email: normalUser.email,
        password: "wrongPassword"
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  after(async () => {
    await User.deleteMany({});
  });
});
