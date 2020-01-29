// test/school/create.test.js

const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const Dummy = require("mongoose-dummy");
const { after, before, describe, it } = exports.lab = Lab.script();
const { init } = require("../../src/lib/server");
const User = require("../../src/model/User");
const School = require("../../src/model/School");
const authFunctions = require("../../src/util/authFunctions");

describe("SCHOOL | CREATE | POST /api/school", () => {
  let server;
  let superUser;
  let normalUser;
  let superAccessToken;
  let normalAccessToken;
  let school;
  const invalidAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMThjNmY5NDk5ZmY2NzI1MGRkMmE2OCIsImVtYWlsIjoidGFzb3NrYW5kYWxha2lzQGdtYWlsLmNvbSIsIm5hbWUiOiJUYXNvcyBTa2FuZGFsYWtpcyIsImlhdCI6MTU3ODcwMDUzOCwiZXhwIjoxNTc4NzA0MTM4fQ.6dGQZuyWWye530PKJeC9VbT-MGy4uLoWRruPR3DfqE4";

  before(async () => {
    server = await init();

    superUser = new User(await Dummy(User));
    superUser.role = "super";
    superUser.password = await authFunctions.hashPassword(superUser.password);
    superUser = await superUser.save();

    normalUser = new User(await Dummy(User));
    normalUser.role = "student";
    normalUser.password = await authFunctions.hashPassword(normalUser.password);
    normalUser = await normalUser.save();

    school = new School(await Dummy(School));
    school = await school.save();

    superAccessToken = await authFunctions.createAccessToken(superUser);
    normalAccessToken = await authFunctions.createAccessToken(normalUser);
  });

  it("responds with 201 and creates school", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/school",
      headers: { authorization: superAccessToken },
      payload: {
        name: "FooBarSchool"
      }
    });

    expect(res.statusCode).to.equal(201);
  });

  it("responds with 400 when missing required field", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/school",
      headers: { authorization: superAccessToken },
      payload: {
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it("responds with 403 when non super tries to send request", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/school",
      headers: { authorization: normalAccessToken },
      payload: {
        name: "FooBarSchool"
      }
    });
    expect(res.statusCode).to.equal(403);
  });

  it("responds with 401 when bad access token is used", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/school",
      headers: { authorization: invalidAccessToken },
      payload: {
        name: "FooBarSchool"
      }
    });
    expect(res.statusCode).to.equal(401);
  });

  after(async () => {
    await User.deleteMany({});
    await School.deleteMany({});
  });
});
