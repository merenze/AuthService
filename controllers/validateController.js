// controllers/validateController.js

module.exports = async (req, res) => {
  req.user
    .update({ emailValidatedAt: new Date() })
    .then((user) =>
      res.status(200).json({ message: `Validated ${user.email}` })
    )
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error saving user." });
    });
};
