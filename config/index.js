// config/index.js
const fs = require("fs");
const path = require("path");

/**
 * Combine all other JS modules in this directory into a single object.
 * @returns {*} Combined configuration object.
 */
const loadConfigurations = () => {
  const config = {};

  // Get files in current directory
  fs.readdirSync(__dirname)
    .filter((file) => {
      // Ignore hidden
      if (file.indexOf(".") === 0) return false;
      // Ignore self
      if (file === path.basename(__filename)) return false;
      // Ignore non-JS
      if (file.slice(-3) !== ".js") return false;

      return true;
    })
    .forEach((file) => {
      config[path.basename(file, ".js")] = require(`./${file}`);
    });
  return config;
};

module.exports = {
  ...loadConfigurations(),
  env: process.env.NODE_ENV || "production",
  port: process.env.PORT || 3000,
  url: process.env.APP_URL || `http://localhost:3000`,
  // Security settings
  bcryptRounds: process.env.BCRYPT_ROUNDS || 10,
  jwtKey: process.env.JWT_KEY,
  emailValidateExpirationHours:
    process.env.EMAIL_VALIDATION_EXPIRATION_HOURS || 0,
  sessionExpirationHours: process.env.SESSION_EXPIRATION_HOURS || 0,
};
