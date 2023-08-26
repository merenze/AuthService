// middleware/loginMiddleware.js

module.exports = {
  // Validate that the necessary fields are provided in the request body.
  requiredFields: (req, res, next) => {
    const errors = {};
    if (req.body.email === undefined) errors.email = "required";
    if (req.body.password === undefined) errors.password = "required";
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
    // TODO EV to determine whether unvalidated users can log in
    if (req.user.emailValidatedAt) {
      next();
      return;
    }
    res.status(403).json({ message: "Email address not yet validated." });
  },
};
