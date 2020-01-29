// test/user/retrieveAll.test.js

const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const Dummy = require("mongoose-dummy");
const { after, before, describe, it } = exports.lab = Lab.script();
const { init } = require("../../src/lib/server");
const User = require("../../src/model/User");
const School = require("../../src/model/School");
const authFunctions = require("../../src/util/authFunctions");

describe("USER | RETRIEVE ALL | GET /api/user", () => {
  let server;
  let school;
  let school2;
  let studentUser;
  let studentUser2;
  let teacherUser;
  let teacherUser2;
  let adminUser;
  let superUser;
  let studentAccessToken;
  let teacherAccessToken;
  let adminAccessToken;
  let superAccessToken;
  const invalidAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMThjNmY5NDk5ZmY2NzI1MGRkMmE2OCIsImVtYWlsIjoidGFzb3NrYW5kYWxha2lzQGdtYWlsLmNvbSIsIm5hbWUiOiJUYXNvcyBTa2FuZGFsYWtpcyIsImlhdCI6MTU3ODcwMDUzOCwiZXhwIjoxNTc4NzA0MTM4fQ.6dGQZuyWWye530PKJeC9VbT-MGy4uLoWRruPR3DfqE4";

  before(async () => {
    server = await init();

    school = new School(await Dummy(School));
    school = await school.save();
    school2 = new School(await Dummy(School));
    school2 = await school2.save();

    studentUser = new User(await Dummy(User));
    studentUser.school_id = school._id;
    studentUser.role = "student";
    studentUser.password = await authFunctions.hashPassword(studentUser.password);
    studentUser = await studentUser.save();

    studentUser2 = new User(await Dummy(User));
    studentUser2.school_id = school2._id;
    studentUser2.role = "student";
    studentUser2.password = await authFunctions.hashPassword(studentUser2.password);
    studentUser2 = await studentUser2.save();

    teacherUser = new User(await Dummy(User));
    teacherUser.school_id = school._id;
    teacherUser.role = "teacher";
    teacherUser.password = await authFunctions.hashPassword(teacherUser.password);
    teacherUser = await teacherUser.save();

    teacherUser2 = new User(await Dummy(User));
    teacherUser2.school_id = school._id;
    teacherUser2.role = "teacher";
    teacherUser2.password = await authFunctions.hashPassword(teacherUser2.password);
    teacherUser2 = await teacherUser2.save();

    adminUser = new User(await Dummy(User));
    adminUser.school_id = school._id;
    adminUser.role = "admin";
    adminUser.password = await authFunctions.hashPassword(adminUser.password);
    adminUser = await adminUser.save();

    superUser = new User(await Dummy(User));
    superUser.role = "super";
    superUser.password = await authFunctions.hashPassword(superUser.password);
    superUser = await superUser.save();

    studentAccessToken = await authFunctions.createAccessToken(studentUser);
    teacherAccessToken = await authFunctions.createAccessToken(teacherUser);
    adminAccessToken = await authFunctions.createAccessToken(adminUser);
    superAccessToken = await authFunctions.createAccessToken(superUser);
  });

  it("responds with 200", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/user",
      headers: { authorization: superAccessToken }
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload).items).to.be.an.array();
    expect(JSON.parse(res.payload).count).to.be.a.number();
  });

  it("responds with 200 and only users with same school_id | student", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/user",
      headers: { authorization: studentAccessToken }
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload).items).to.be.an.array();
    expect(JSON.parse(res.payload).count).to.be.a.number();
  });

  it("responds with 200 with pagination", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/user?page=1&size=10&search=" + studentUser.name,
      headers: { authorization: superAccessToken }
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload).items).to.be.an.array();
    expect(JSON.parse(res.payload).items.length).to.be.greaterThan(0);
    expect(JSON.parse(res.payload).count).to.be.a.number();
    expect(JSON.parse(res.payload).count).to.be.greaterThan(0);
  });

  it("responds with 401 when bad access token is used", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/user",
      headers: { authorization: invalidAccessToken }
    });
    expect(res.statusCode).to.equal(401);
  });

  after(async () => {
    await User.deleteMany({});
    await School.deleteMany({});
  });
});
