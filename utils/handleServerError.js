// utils/handleServerError.js

/**
 * Send a 500 response with a message in the body.
 * @param {Error} error 
 * @param {*} res The response object
 * @param {string} [message] Custom error message (optional).
 */
module.exports = (error, res, message) => {
  console.error(error);
  res.status(500).json({
    message: process.env.NODE_ENV === "development"
      ? error.message
      : message || "Internal error",
  });
};
