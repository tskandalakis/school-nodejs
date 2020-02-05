// test/course/retrieveAll.test.js

const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const Dummy = require("mongoose-dummy");
const { after, before, describe, it } = exports.lab = Lab.script();
const { init } = require("../../src/lib/server");
const User = require("../../src/model/User");
const School = require("../../src/model/School");
const Course = require("../../src/model/Course");
const authFunctions = require("../../src/util/authFunctions");

describe("COURSE | RETRIEVE ALL | GET /api/course", () => {
  let server;
  let school;
  let school2;
  let course;
  let course2;
  let course3;
  let studentUser;
  let teacherUser;
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

    teacherUser = new User(await Dummy(User));
    teacherUser.school_id = school._id;
    teacherUser.role = "teacher";
    teacherUser.password = await authFunctions.hashPassword(teacherUser.password);
    teacherUser = await teacherUser.save();

    adminUser = new User(await Dummy(User));
    adminUser.school_id = school._id;
    adminUser.role = "admin";
    adminUser.password = await authFunctions.hashPassword(adminUser.password);
    adminUser = await adminUser.save();

    superUser = new User(await Dummy(User));
    superUser.role = "super";
    superUser.password = await authFunctions.hashPassword(superUser.password);
    superUser = await superUser.save();

    course = new Course(await Dummy(Course));
    course.school_id = school._id;
    course.students = [studentUser._id];
    course = await course.save();

    course2 = new Course(await Dummy(Course));
    course2.school_id = school._id;
    course2.visible = false;
    course2.students = [studentUser._id];
    course2 = await course2.save();

    course3 = new Course(await Dummy(Course));
    course3.school_id = school2._id;
    course3.students = [];
    course3 = await course3.save();

    studentAccessToken = await authFunctions.createAccessToken(studentUser);
    teacherAccessToken = await authFunctions.createAccessToken(teacherUser);
    adminAccessToken = await authFunctions.createAccessToken(adminUser);
    superAccessToken = await authFunctions.createAccessToken(superUser);
  });

  it("responds with 200 - super", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/course",
      headers: { authorization: superAccessToken }
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload).items).to.be.an.array();
    expect(JSON.parse(res.payload).count).to.equal(3);
  });

  it("responds with 200 - admin", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/course",
      headers: { authorization: adminAccessToken }
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload).items).to.be.an.array();
    expect(JSON.parse(res.payload).count).to.equal(2);
  });

  it("responds with 200 - teacher", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/course",
      headers: { authorization: teacherAccessToken }
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload).items).to.be.an.array();
    expect(JSON.parse(res.payload).count).to.equal(2);
  });

  it("responds with 200 - student", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/course",
      headers: { authorization: studentAccessToken }
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload).items).to.be.an.array();
    expect(JSON.parse(res.payload).count).to.equal(1);
  });

  it("responds with 200 with pagination filter by school_id - super", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/course?page=1&size=10&search=" + course3.name + "&school_id=" + school2._id,
      headers: { authorization: superAccessToken }
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload).items).to.be.an.array();
    expect(JSON.parse(res.payload).items.length).to.equal(1);
    expect(JSON.parse(res.payload).count).to.be.a.number();
    expect(JSON.parse(res.payload).count).to.equal(1);
  });

  it("responds with 200 with pagination - admin", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/course?page=1&size=10&search=" + course.name,
      headers: { authorization: adminAccessToken }
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload).items).to.be.an.array();
    expect(JSON.parse(res.payload).items.length).to.equal(1);
    expect(JSON.parse(res.payload).count).to.be.a.number();
    expect(JSON.parse(res.payload).count).to.equal(1);
  });

  it("responds with 200 with pagination - student", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/course?page=1&size=10&search=" + course.name,
      headers: { authorization: studentAccessToken }
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload).items).to.be.an.array();
    expect(JSON.parse(res.payload).items.length).to.equal(1);
    expect(JSON.parse(res.payload).count).to.be.a.number();
    expect(JSON.parse(res.payload).count).to.equal(1);
  });

  it("responds with 401 when bad access token is used", async () => {
    const res = await server.inject({
      method: "get",
      url: "/api/course",
      headers: { authorization: invalidAccessToken }
    });
    expect(res.statusCode).to.equal(401);
  });

  after(async () => {
    await User.deleteMany({});
    await School.deleteMany({});
    await Course.deleteMany({});
  });
});
