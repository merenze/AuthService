// models/index.js
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const config = require("../config/");
const seqConfig = config.sequelize[config.env];
const db = {};

const sequelize = seqConfig.use_env_variable
  ? new Sequelize(process.env[seqConfig.use_env_variable], seqConfig)
  : new Sequelize(seqConfig.database, seqConfig.username, seqConfig.password, seqConfig);

fs.readdirSync(__dirname)
  .filter((file) => {
    console.log("Found file: ", file);
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    console.log("Using file: " + file);
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
