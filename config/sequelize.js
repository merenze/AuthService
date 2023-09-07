require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: (query, options) => {
      // Don't log queries related to SequelizeMeta
      if (query.includes("SequelizeMeta")) {
        return;
      }
      console.log(query);
    },
  },
  test: {
    database: 'sqlite::memory:',
    dialect: 'sqlite',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};
