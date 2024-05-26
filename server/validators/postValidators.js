const { body } = require('express-validator');

const validators = {
    postValidator: [
        body("title").notEmpty().withMessage("Title is required."),
        body("content").notEmpty().withMessage("Post content is required")
    ]
};

module.exports = validators;