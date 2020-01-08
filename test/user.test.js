"use strict";

const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require("../src/lib/server");

describe("USER TESTS", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it("POST api/search | responds with 200", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/search",
      payload: {
        tld: "gtld",
        term: "test"
      }
    });
    expect(res.statusCode).to.equal(200);
  });

  it("POST api/search | responds with array", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/search",
      payload: {
        tld: "gtld",
        term: "test"
      }
    });
    expect(JSON.parse(res.payload)).to.be.an.array();
  });

  it("POST api/search | responds with 400 when missing tld", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/search",
      payload: {
        term: "test"
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it("POST api/search | responds with 400 when missing term", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/search",
      payload: {
        tld: "gtld"
      }
    });
    expect(res.statusCode).to.equal(400);
  });
});
