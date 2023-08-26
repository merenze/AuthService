// controllers/userController.js

module.exports = {

    /**
     * Get a user by ID.
     * @param {*} req 
     * @param {*} res 
     */
    find: async (req, res) => res.status(200).json(req.user),
}