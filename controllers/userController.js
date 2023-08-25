// controllers/userController.js
const { User } = require("../models")

module.exports = {

    /**
     * Get a user by ID.
     * @param {*} req 
     * @param {*} res 
     */
    find: async (req, res) => res.status(200).json(req.user),
}