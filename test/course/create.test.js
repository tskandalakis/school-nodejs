// test/course/create.test.js

const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const Dummy = require("mongoose-dummy");
const { after, before, describe, it } = exports.lab = Lab.script();
const { init } = require("../../src/lib/server");
const User = require("../../src/model/User");
const Course = require("../../src/model/Course");
const School = require("../../src/model/School");
const authFunctions = require("../../src/util/authFunctions");

describe("COURSE | CREATE | POST /api/course", () => {
  let server;
  let school;
  let school2;
  let studentUser;
  let studentUser2;
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

    studentUser2 = new User(await Dummy(User));
    studentUser2.school_id = school._id;
    studentUser2.role = "student";
    studentUser2.password = await authFunctions.hashPassword(studentUser2.password);
    studentUser2 = await studentUser2.save();

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

    studentAccessToken = await authFunctions.createAccessToken(studentUser);
    teacherAccessToken = await authFunctions.createAccessToken(teacherUser);
    adminAccessToken = await authFunctions.createAccessToken(adminUser);
    superAccessToken = await authFunctions.createAccessToken(superUser);
  });

  it("responds with 201 and creates course - super", async () => {
    const dummyCourse = new Course(await Dummy(Course));

    const res = await server.inject({
      method: "post",
      url: "/api/course",
      headers: { authorization: superAccessToken },
      payload: {
        school_id: school._id,
        name: dummyCourse.name,
        title: dummyCourse.title,
        description: dummyCourse.description,
        units: dummyCourse.units,
        visible: dummyCourse.visible,
        startDate: dummyCourse.startDate,
        endDate: dummyCourse.endDate,
        students: [studentUser._id, studentUser2._id]
      }
    });

    expect(res.statusCode).to.equal(201);
  });

  it("responds with 400 and fails to create course if missing school_id as a super - super", async () => {
    const dummyCourse = new Course(await Dummy(Course));

    const res = await server.inject({
      method: "post",
      url: "/api/course",
      headers: { authorization: superAccessToken },
      payload: {
        name: dummyCourse.name,
        title: dummyCourse.title,
        description: dummyCourse.description,
        units: dummyCourse.units,
        visible: dummyCourse.visible,
        startDate: dummyCourse.startDate,
        endDate: dummyCourse.endDate,
        students: [studentUser._id, studentUser2._id]
      }
    });

    expect(res.statusCode).to.equal(400);
  });

  it("responds with 201 and creates course - admin", async () => {
    const dummyCourse = new Course(await Dummy(Course));

    const res = await server.inject({
      method: "post",
      url: "/api/course",
      headers: { authorization: adminAccessToken },
      payload: {
        name: dummyCourse.name,
        title: dummyCourse.title,
        description: dummyCourse.description,
        units: dummyCourse.units,
        visible: dummyCourse.visible,
        startDate: dummyCourse.startDate,
        endDate: dummyCourse.endDate,
        students: [studentUser._id, studentUser2._id]
      }
    });

    expect(res.statusCode).to.equal(201);
  });

  it("responds with 201 and creates course - teacher", async () => {
    const dummyCourse = new Course(await Dummy(Course));

    const res = await server.inject({
      method: "post",
      url: "/api/course",
      headers: { authorization: teacherAccessToken },
      payload: {
        name: dummyCourse.name,
        title: dummyCourse.title,
        description: dummyCourse.description,
        units: dummyCourse.units,
        visible: dummyCourse.visible,
        startDate: dummyCourse.startDate,
        endDate: dummyCourse.endDate,
        students: [studentUser._id, studentUser2._id]
      }
    });

    expect(res.statusCode).to.equal(201);
  });

  it("responds with 403 and fails to create course - student", async () => {
    const dummyCourse = new Course(await Dummy(Course));

    const res = await server.inject({
      method: "post",
      url: "/api/course",
      headers: { authorization: studentAccessToken },
      payload: {
        name: dummyCourse.name,
        title: dummyCourse.title,
        description: dummyCourse.description,
        units: dummyCourse.units,
        visible: dummyCourse.visible,
        startDate: dummyCourse.startDate,
        endDate: dummyCourse.endDate,
        students: [studentUser._id, studentUser2._id]
      }
    });

    expect(res.statusCode).to.equal(403);
  });

  it("responds with 403 and fails to create course for using school_id by a non super - admin", async () => {
    const dummyCourse = new Course(await Dummy(Course));

    const res = await server.inject({
      method: "post",
      url: "/api/course",
      headers: { authorization: adminAccessToken },
      payload: {
        school_id: school._id,
        name: dummyCourse.name,
        title: dummyCourse.title,
        description: dummyCourse.description,
        units: dummyCourse.units,
        visible: dummyCourse.visible,
        startDate: dummyCourse.startDate,
        endDate: dummyCourse.endDate,
        students: [studentUser._id, studentUser2._id]
      }
    });

    expect(res.statusCode).to.equal(403);
  });

  it("responds with 400 when missing required field", async () => {
    const dummyCourse = new Course(await Dummy(Course));

    const res = await server.inject({
      method: "post",
      url: "/api/course",
      headers: { authorization: teacherAccessToken },
      payload: {
        title: dummyCourse.title,
        description: dummyCourse.description,
        units: dummyCourse.units,
        visible: dummyCourse.visible,
        startDate: dummyCourse.startDate,
        endDate: dummyCourse.endDate,
        students: [studentUser._id, studentUser2._id]
      }
    });

    expect(res.statusCode).to.equal(400);
  });

  it("responds with 401 when bad access token is used", async () => {
    const dummyCourse = new Course(await Dummy(Course));

    const res = await server.inject({
      method: "post",
      url: "/api/course",
      headers: { authorization: invalidAccessToken },
      payload: {
        name: dummyCourse.name,
        title: dummyCourse.title,
        description: dummyCourse.description,
        units: dummyCourse.units,
        visible: dummyCourse.visible,
        startDate: dummyCourse.startDate,
        endDate: dummyCourse.endDate,
        students: [studentUser._id, studentUser2._id]
      }
    });

    expect(res.statusCode).to.equal(401);
  });

  after(async () => {
    await User.deleteMany({});
    await School.deleteMany({});
    await Course.deleteMany({});
  });
});
