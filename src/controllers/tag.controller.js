const tagService = require('../services/tag.service');
const asyncHandler = require('../utils/asyncHandler');

const tagController = {
    getAllTags: asyncHandler(async (req, res) => {
        const tags = await tagService.getAllTags();
        res.status(200).json(todos);
    }),

    createTag: asyncHandler(async (req, res) => {
        const createdTag = await tagService.createTag(req.body);
        res.status(201).json(createdTag);
    })
};

module.exports = tagController;