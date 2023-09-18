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
      .send({ password: "johnpw" })
      .expect(400)
      .end((err, res) => (err ? done(err) : done()));
  });

  it("should respond 400 when password is not present", (done) => {
    request
      .post("/login")
      .send({ email: "john.login@example.com" })
      .expect(400)
      .end((err, res) => (err ? done(err) : done()));
  });

  it("should respond 404 when email is not in database", (done) => {
    request
      .post("/login")
      .send({
        email: "john.login@example.com",
        password: "johnpw",
      })
      .expect(404)
      .end((err, res) => (err ? done(err) : done()));
  });

  it("should respond 401 when password is incorrect", (done) => {
    request
      .post("/register")
      .send({
        email: "john.login@example.com",
        password: "johnpw",
      })
      .end(() =>
        request
          .post("/login")
          .send({
            email: "john.login@example.com",
            password: "badpw",
          })
          .expect(401)
          .end((err) => (err ? done(err) : done()))
      );
  });

  it("should respond 403 when email and password are correct but email isn't validated", (done) => {
    request
      .post("/register")
      .send({
        email: "john.login@example.com",
        password: "johnpw",
      })
      .end(() =>
        request
          .post("/login")
          .send({
            email: "john.login@example.com",
            password: "johnpw",
          })
          .expect(403)
          .end((err) => (err ? done(err) : done()))
      );
  });

  it("should respond 200 when email and password are correct and email is validated", (done) => {
    request
      .post("/register")
      .send({
        email: "john.login@example.com",
        password: "johnpw",
      })
      .end(async () => {
        await sequelize
          .query(
            `UPDATE users SET emailValidatedAt = '${new Date()}' WHERE email = 'john.login@example.com'`
          )
          .catch((err) => done(err));
        request
          .post("/login")
          .send({
            email: "john.login@example.com",
            password: "johnpw",
          })
          .expect(200)
          .end((err) => (err ? done(err) : done()));
      });
  });
});
