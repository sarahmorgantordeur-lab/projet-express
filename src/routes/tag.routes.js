const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tag.controller');

router.get('/', TagController.getAllTags);

router.post('/', TagController.createTag);

module.exports = router;
