const Comment = require("../models/Comment");
const { validationResult } = require("express-validator");

let controller = {
    getComments: async (req,res) =>{
        let Comments = await Comment.find({}).populate('createdBy','fullname email');
        return res.status(200).json(Comments);        
    },
    addComment: async (req,res)=>{
        let errors = validationResult(req);
        if(!errors.isEmpty()) return res.json(errors);
        req.body.createdBy = req.user._id;
        let comment = await Comment.create(req.body);
        return res.json(comment);
    },
    getCommentsOfUser: async (req,res) =>{
        let userId = req.user._id;
        let Comments = await Comment.find({
            createdBy:{_id:userId}
        }).populate('createdBy','fullname email');
        return res.status(200).json(Comments);        
    },
};

module.exports = controller;
