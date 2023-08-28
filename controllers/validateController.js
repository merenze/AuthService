// controllers/validateController.js
const handleServerError = require("../utils/handleServerError");

module.exports = async (req, res) => {
  req.user
    .update({ emailValidatedAt: new Date() })
    .then((user) =>
      res.status(200).json({ message: `Validated ${user.email}` })
    )
    .catch((error) => handleServerError(error, res, "An error ocurred while attempting to save the user."));
};
