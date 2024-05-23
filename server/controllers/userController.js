const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Utils = require("../Utils/JWTUtils");

let controllers = {
    getUser: async (req,res)=>{
        let userId = req.user._id;
        let user = await User.findOne({_id:userId},
            {fullname: 1,email: 1, _id:1});
        return res.status(200).json(user);
    },
    register: async (req,res) => {
        let errors = validationResult(req);
        if(errors.isEmpty()) {
            req.body.password = bcrypt.hashSync(req.body.password);
            req.body.accesstoken="";
            req.body.refreshtoken="";
            let user = await User.create(req.body);
            return res.json({Message: `Registered user successfully!`,_id:user._id});
        }
        return res.json(errors);
    },
    login: async (req,res) => {
        let errors = validationResult(req);
        if(!errors.isEmpty()) return res.json(errors);
        let user = await User.findOne({ email: req.body.email });
        if(user && bcrypt.compareSync(req.body.password,user.password)){
            if(user.accesstoken != ""){
                return res.json({
                    accesstoken: user.accesstoken,
                    refreshtoken: user.refreshtoken
                });
            }
            let {accesstoken,refreshtoken} = Utils.generateAccessTokens(user._id,user.email);
            user.accesstoken = accesstoken;
            user.refreshtoken = refreshtoken;
            await user.save();
            return res.json({
                accesstoken,
                refreshtoken
            });
        }
        else return res.json({Error:"Wrong E-Mail or password."})
    },
    refreshtoken: async (req, res) => {
        const rtoken = req.body.refreshtoken;

        if (!rtoken) {
            return res.status(400).json({ Error: 'Missing refresh token' });
        }

        try {
            const decoded = Utils.verifyToken(rtoken,"refresh");
            const userId = decoded.userId; // Extract user ID from refresh token

            // Check if refresh token is valid (e.g., in a database)
            let user = await User.findOne({
                refreshtoken: rtoken
            });
            if(Object.keys(user).length == 0) return res.status(401).json({ Error: 'Invalid refresh token' });

            // Implement logic to check if refresh token is still valid (not blacklisted, etc.)

            const {accesstoken,refreshtoken} = Utils.generateAccessTokens(userId,user.email);
            user.accesstoken = accesstoken;
            user.refreshtoken = refreshtoken;
            await user.save();

            res.json({ accesstoken: accesstoken, refreshtoken: accesstoken });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ Error: 'Invalid refresh token' });
        }
    },
    changePassword: async (req,res)=> {
        let errors = validationResult(req);
        if(!errors.isEmpty()) return res.json(errors);
        try{
            let password = req.body.password;
            let newpassword = bcrypt.hashSync(req.body.newpassword);
            let user = await User.findOne({
                _id: req.user._id
            });
            if(bcrypt.compareSync(password,user.password)){
                user.password = newpassword;
                await user.save();
                return res.status(200).json({Message:"Password was changed successfully!"})
            }else{
                return res.status(401).json({Error:"Wrong password."})
            }
        }catch(e){
            console.log(e);
            return res.status(401).json({Error:"Invalid token."})
        }
    },
    changeFullname: async (req,res) =>{
        let errors = validationResult(req);
        if(!errors.isEmpty()) return res.json(errors);
        let user = await User.findOne({_id: req.user._id});
        user.fullname = req.body.fullname;
        await user.save();
        return res.status(200).json({Message:"Fullname was changed successfully!"});
    },
    changeEmail: async (req,res) => {
        let errors = validationResult(req);
        if(!errors.isEmpty()) return res.json(errors);
        let user = await User.findOne({_id: req.user._id});
        user.email = req.body.email;
        await user.save();
        return res.status(200).json({Message:"Email was changed successfully!"});
    },
    logout: async (req,res)=>{
        let user = await User.findOne({_id: req.user._id});
        user.accesstoken = "";
        user.refreshtoken = "";
        await user.save();
        return res.status(200).json({Message:"Successfully logged out."});
    }
}

module.exports = controllers;