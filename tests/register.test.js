// tests/auth.test.js
const { describe, done } = require("mocha");
const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const assert = require("assert");

describe("Register endpoint", async () => {
  it("should respond with status 400 when email is not present", (done) => {
    request
      .post("/register")
      .send({ password: "johnsmithpw"})
      .expect(400)
      .end((err, res) => err ? done(err) : done());
  });

  it("should respond 400 when password is not present", (done) => {
    request
      .post("/register")
      .send({ email: "john.smith@example.com"})
      .expect(400)
      .end((err, res) => (err ? done(err) : done()));
  });

  it("should respond 400 when email and password are not present", (done) => {
    request
      .post("/register")
      .send({})
      .expect(400)
      .end((err, res) => (err ? done(err) : done()));
  });

  it("should respond 400 when email format is invalid", (done) => {
    request
      .post("/register")
      .send({ email: "john.smith", password: "johnsmithpw" })
      .expect(400)
      .end((err, res) => (err ? done(err) : done()));
  });

  it("should respond 201 when email and password are both present", (done) => {
    request
      .post("/register")
      .send({ email: "john.smith@example.com", password: "johnsmithpw" })
      .expect(201)
      .end((err, res) => (err ? done(err) : done()));
  });

  it("should respond 400 when the email is already in the database", (done) => {
    request
      .post("/register")
      .send({ email: "john.smith@example.com", password: "johnsmithpw" })
      .expect(400)
      .end((err, res) => (err ? done(err) : done()));
  });
});
