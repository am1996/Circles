const { body } = require('express-validator');

const validators = {
    commentValidator: [
        body("content").notEmpty().withMessage("Comment content is required")
    ]
};

module.exports = validators;