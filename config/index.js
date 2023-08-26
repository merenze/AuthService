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

const appConfig = {
  env: process.env.NODE_ENV || "production",
  port: process.env.PORT || 3000,
  protocol: process.env.PROTOCOL || "http",
  domain: process.env.APP_DOMAIN || "localhost",
};

module.exports = {
    ...loadConfigurations(),
    ...appConfig,

    appUrl: `${appConfig.protocol}://${appConfig.domain}:${appConfig.port}`,

    emailValidateExpirationHours: process.env.EMAIL_VALIDATION_EXPIRATION_HOURS || 0,
    sessionExpirationHours: process.env.SESSION_EXPIRATION_HOURS || 0,
};
