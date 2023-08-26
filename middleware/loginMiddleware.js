// middleware/loginMiddleware.js

module.exports = {
  // Validate that the necessary fields are provided in the request body.
  requiredFields: (req, res, next) => {
    errors = [];
    if (req.body.email === undefined) errors.push({ email: "required" });
    if (req.body.password === undefined) errors.push({ password: "required" });
    if (errors.length <= 0) {
      next();
      return;
    }
    res.status(400).json({
      message: "Missing required fields.",
      errors: errors,
    });
  },
  // Validate that the user's email is validated
  emailValidated: (req, res, next) => {
    if (req.user.emailValidatedAt) {
      next();
      return;
    }
    res.status(403).json({ message: "Email address not yet validated." });
  },
};
