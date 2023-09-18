// tests/auth.test.js
const { describe } = require("mocha");
const { sequelize } = require("../models/");
const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

before(async () => await sequelize.sync({ force: true }));

describe("Register endpoint", async () => {
  it("should respond with status 400 when email is not present", (done) => {
    request
      .post("/register")
      .send({ password: "johnpw"})
      .expect(400)
      .end((err, res) => err ? done(err) : done());
  });

  it("should respond 400 when password is not present", (done) => {
    request
      .post("/register")
      .send({ email: "john.register@example.com"})
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
      .send({ email: "john.register", password: "johnpw" })
      .expect(400)
      .end((err, res) => (err ? done(err) : done()));
  });

  it("should respond 201 when email and password are both present", (done) => {
    request
      .post("/register")
      .send({ email: "john.register@example.com", password: "johnpw" })
      .expect(201)
      .end((err, res) => (err ? done(err) : done()));
  });

  it("should respond 400 when the email is already in the database", (done) => {
    request
      .post("/register")
      .send({ email: "john.register@example.com", password: "john" })
      .expect(400)
      .end((err, res) => (err ? done(err) : done()));
  });
});
