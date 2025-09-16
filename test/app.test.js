const request = require("supertest");
const app = require("../app"); // use the express app, not index.js

describe("basic routes", () => {
  it("GET / returns JSON", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
