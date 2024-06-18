const Comment = require("../models/Comment");
const { validationResult } = require("express-validator");

let controller = {
    getComments: async (req, res) => {
        let Comments = await Comment.find({}).populate('createdBy', 'fullname email');
        return res.status(200).json(Comments);
    },
    addComment: async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) return res.json(errors);
        req.body.createdBy = req.user._id;
        let comment = await Comment.create(req.body);
        return res.json(comment);
    },
    getCommentsOfPost: async (req, res) => {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 1;
        const skip = (page - 1) * limit;
        let postId = req.params.id;
        let itemsCount = await Comment.countDocuments({ postId: postId });
        let comments = await Comment.find({ postId: postId }, null, {
            limit: limit,
            skip: skip,
        }).sort([['createdAt', -1]]).populate('createdBy', 'fullname email');
        comments = { comments: comments, pages: Math.floor(itemsCount / limit) }
        return res.json(comments);
    },
    getCommentsOfUser: async (req, res) => {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 1;
        const skip = (page - 1) * limit;
        let userId = req.user._id;
        let itemsCount = await Comment.countDocuments({ createdBy: { _id: userId } });

        let comments = await Comment.find({
            createdBy: { _id: userId }
        }, null, {
            limit: limit,
            skip: skip
        }).sort([['createdAt', -1]]).populate('createdBy', 'fullname email');
        comments = { comments: comments, pages: Math.floor(itemsCount / limit) }
        return res.status(200).json(comments);
    },
};

module.exports = controller;
