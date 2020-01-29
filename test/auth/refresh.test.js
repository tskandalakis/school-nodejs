// test/auth/login.test.js
const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const Dummy = require("mongoose-dummy");
const { after, before, describe, it } = exports.lab = Lab.script();
const { init } = require("../../src/lib/server");
const User = require("../../src/model/User");
const authFunctions = require("../../src/util/authFunctions");

describe("AUTH | REFRESH | POST /api/auth/refresh", () => {
  let server;
  let normalUser;
  let validAccessToken;
  let validRefreshToken;
  const invalidAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMThjNmY5NDk5ZmY2NzI1MGRkMmE2OCIsImVtYWlsIjoidGFzb3NrYW5kYWxha2lzQGdtYWlsLmNvbSIsIm5hbWUiOiJUYXNvcyBTa2FuZGFsYWtpcyIsImlhdCI6MTU3ODcwMDUzOCwiZXhwIjoxNTc4NzA0MTM4fQ.6dGQZuyWWye530PKJeC9VbT-MGy4uLoWRruPR3DfqE4";
  const invalidRefreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMThlY2NiMDQ1ZGUyYzVkY2NkYWI2OSIsImlhdCI6MTU3ODk2MzkzNSwiZXhwIjoxNTc5MDUwMzM1fQ.6dGQZuyWWye530PKJeC9VbT-MGy4uLoWRruPR3DfqE4";

  before(async () => {
    server = await init();

    normalUser = new User(await Dummy(User));
    normalUser.role = "student";
    normalUser.password = await authFunctions.hashPassword(normalUser.password);
    normalUser = await normalUser.save();

    validAccessToken = await authFunctions.createAccessToken(normalUser);
    validRefreshToken = await authFunctions.createRefreshToken(normalUser);
  });

  it("responds with 201 and new access token when valid refresh token and valid auth are used", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/refresh",
      headers: { authorization: validAccessToken },
      payload: {
        refresh_token: validRefreshToken
      }
    });
    expect(res.statusCode).to.equal(201);
  });

  it("responds with 401 when invalid refresh token and valid auth", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/refresh",
      headers: { authorization: validAccessToken },
      payload: {
        refresh_token: invalidRefreshToken
      }
    });
    expect(res.statusCode).to.equal(401);
  });

  it("responds with 400 when no refresh token is passed wtih valid auth", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/refresh",
      headers: { authorization: validAccessToken },
      payload: {
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it("responds with 401 with invalid auth", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/refresh",
      headers: { authorization: invalidAccessToken },
      payload: {
        refresh_token: invalidRefreshToken
      }
    });
    expect(res.statusCode).to.equal(401);
  });

  after(async () => {
    await User.deleteMany({});
  });
});
