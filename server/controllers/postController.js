const { default: mongoose } = require("mongoose");
const Post = require("../models/Post");
const { validationResult } = require("express-validator");
const Like = require("../models/Like");
const Follow = require("../models/Follow");

let controller = {
    getPosts: async (req, res) => {
        let followedUsers = await Follow.find({followerId: req.user._id});
        followedUsers = followedUsers.map(item => {
            return item.followingId;
        });
        let posts = await Post.find(
            {createdBy:{$in:followedUsers}}, null, 
            { sort: { createdAt: -1 } }).populate('createdBy', 'fullname email');
        return res.status(200).json(posts);
    },
    addPost: async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) return res.json(errors);
        req.body.createdBy = req.user._id;
        let post = await Post.create(req.body);
        return res.json(post);
    },
    deletePost: async (req, res) => {
        let userId = req.user._id;
        let postId = req.params.id;
        let post = await Post.findOneAndDelete({ createdBy: userId, _id: postId });
        return res.json({ "message": "Post deleted." });
    },
    getPostsOfUser: async (req, res) => {
        let userId = req.user._id;
        let posts = await Post.find({
            createdBy: { _id: userId }
        }).populate('createdBy', 'fullname email');
        return res.status(200).json(posts);
    },
    searchPost: async (req, res) => {
        let q = req.query.q;
        let posts = await Post.find({
            $or: [
                {content: { $regex: q, $options: 'i' }},
                {title: { $regex: q, $options: 'i' }},
            ]
        }).populate('createdBy', 'fullname email _id');
        return res.status(200).json(posts);
    },
    getPost: async (req, res) => {
        let userId = req.user._id;
        let postId = req.params.id;
        const like = !!(await Like.findOne({ userId, postId }));
        const numOfLikes = await Like.find({ postId: postId });
        let post = await Post.aggregate([
            {
                $match: { "_id": new mongoose.Types.ObjectId(postId) }
            },
            {
                $lookup: {
                    from: 'comments', // Replace with your comment collection name
                    localField: '_id', // Match comments' postId with post's _id
                    foreignField: 'postId',
                    as: 'comments',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'createdBy',
                                foreignField: '_id',
                                as: 'owner',
                                pipeline: [
                                    { $project: { fullname: 1, email: 1 } }
                                ]
                            },
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users', // Replace with your comment collection name
                    localField: 'createdBy', // Match comments' postId with post's _id
                    foreignField: '_id',
                    as: 'owner',
                    pipeline: [
                        { $project: { fullname: 1, email: 1 } }
                    ]
                }
            },
        ]);
        if(Object.keys(post).length > 0){
            post[0].liked = like;
            post[0].likesCount = numOfLikes.length;
            return res.status(200).json(post);
        }else{
            return res.status(200).json({});
        }
    },
    likePost: async (req, res) => {
        let postId = req.params.id;
        let userId = req.user._id;
        let existingLike = await Like.findOne({ postId, userId });
        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            return res.json({ "message": "Post unliked" });
        } else {
            await Like.create({ userId, postId, liked: true });
            return res.json({ "message": "Post liked" });
        }
    },
};

module.exports = controller;
