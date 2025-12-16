const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');

const UserController = {
    getAllUsers: asyncHandler(async (req, res) => {

        const users = await userService.getAllUsers();
        res.status(200).json(users);
    }),

    createUser: asyncHandler(async (req, res) => {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    })
};

module.exports = UserController;