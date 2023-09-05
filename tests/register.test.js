// tests/auth.test.js
const { describe } = require("mocha");
const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

describe("Register endpoint", () => {
  it("should respond with status 400 when email is not present", () => {
    // TODO
  });

  it("should respond 400 when password is not present", () => {
    // TODO
  });

  it("should respond 400 when email and password are not present", () => {
    // TODO
  });

  it("should respond 201 when email and password are both present", () => {
    // TODO
  });

  it("should respond 200 when the email is already in the database", () => {
    // TODO
  });
});
