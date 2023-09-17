// tests/login.test.js
const { describe } = require("mocha");
const { sequelize } = require("../models/");
const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

before(async () => await sequelize.sync({ force: true }));

describe("Login endpoint", async () => {
    it("should respond with status 400 when email is not present", (done) => {
      request
        .post("/login")
        .send({ password: "johnsmithpw" })
        .expect(400)
        .end((err, res) => (err ? done(err) : done()));
    });

    it("should respond 400 when password is not present", (done) => {
      request
        .post("/login")
        .send({ email: "john.smith@example.com" })
        .expect(400)
        .end((err, res) => (err ? done(err) : done()));
    });

  it("should respond 404 when email is not in database", (done) => {
      request
        .post("/login")
        .send({
          email: "john.smith@example.com",
          password: "johnpw",
        })
        .expect(404)
        .end((err, res) => (err ? done(err) : done()));
    })
});