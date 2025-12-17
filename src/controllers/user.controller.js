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
    }),

    findById: asyncHandler(async (req, res) => {
        const user = await userService.findById(parseInt(req.params.id, 10));  
        res.status(200).json(user);   
}),
    delete_user: asyncHandler(async (req, res) => {
        await userService.delete_user(parseInt(req.params.id, 10));  
        res.status(204).send();   
    }),

};

module.exports = UserController;