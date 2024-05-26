const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Utils = require("../Utils/JWTUtils");
const Follow = require("../models/Follow");

let controllers = {
	searchUser: async (req, res) => {
		let q = req.query.q;
		let users = await User.find({
			$or: [
				{ fullname: { $regex: q, $options: 'i' } },
				{ email: { $regex: q, $options: 'i' } },
			]
		});
		return res.status(200).json(users);
	},
	getUser: async (req, res) => {
		let userId = req.user._id;
		let user = await User.findOne({ _id: userId },
			{ fullname: 1, email: 1, _id: 1 });
		return res.status(200).json(user);
	},
	getUserById: async (req,res) => {
		let followerId = req.user._id;
		let userId = req.params.id;
		let user = await User.findOne({ _id: userId },
			{ fullname: 1, email: 1, _id: 1, createdAt:1 });
		let follows = await Follow.countDocuments({followingId:userId}).exec();
		const followed = !!(await Follow.findOne({ followerId:followerId, followingId:userId }));
		user.numberOfFollowers = follows;
		return res.status(200).json({user,numberOfFollowers:follows,followed});
	},
	register: async (req, res) => {
		let errors = validationResult(req);
		if (errors.isEmpty()) {
			req.body.password = bcrypt.hashSync(req.body.password);
			req.body.accesstoken = "";
			req.body.refreshtoken = "";
			let user = await User.create(req.body);
			return res.json({ Message: `Registered user successfully!`, _id: user._id });
		}
		return res.json(errors);
	},
	login: async (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) return res.json(errors);
		let user = await User.findOne({ email: req.body.email });
		if (user && bcrypt.compareSync(req.body.password, user.password)) {
			if (user.accesstoken != "") {
				return res.json({
					accesstoken: user.accesstoken,
					refreshtoken: user.refreshtoken
				});
			}
			let { accesstoken, refreshtoken } = Utils.generateAccessTokens(user._id, user.email);
			user.accesstoken = accesstoken;
			user.refreshtoken = refreshtoken;
			await user.save();
			return res.json({
				accesstoken,
				refreshtoken
			});
		}
		else return res.json({ Error: "Wrong E-Mail or password." })
	},
	refreshtoken: async (req, res) => {
		const rtoken = req.body.refreshtoken;

		if (!rtoken) {
			return res.status(400).json({ Error: 'Missing refresh token' });
		}

		try {
			const decoded = Utils.verifyToken(rtoken, "refresh");
			const userId = decoded.userId; // Extract user ID from refresh token

			// Check if refresh token is valid (e.g., in a database)
			let user = await User.findOne({
				refreshtoken: rtoken
			});
			if (Object.keys(user).length == 0) return res.status(401).json({ Error: 'Invalid refresh token' });

			// Implement logic to check if refresh token is still valid (not blacklisted, etc.)

			const { accesstoken, refreshtoken } = Utils.generateAccessTokens(userId, user.email);
			user.accesstoken = accesstoken;
			user.refreshtoken = refreshtoken;
			await user.save();

			res.json({ accesstoken: accesstoken, refreshtoken: accesstoken });
		} catch (error) {
			return res.status(401).json({ Error: 'Invalid refresh token' });
		}
	},
	changePassword: async (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) return res.json(errors);
		try {
			let password = req.body.password;
			let newpassword = bcrypt.hashSync(req.body.newpassword);
			let user = await User.findOne({
				_id: req.user._id
			});
			if (bcrypt.compareSync(password, user.password)) {
				user.password = newpassword;
				await user.save();
				return res.status(200).json({ Message: "Password was changed successfully!" })
			} else {
				return res.status(401).json({ Error: "Wrong password." })
			}
		} catch (e) {
			return res.status(401).json({ Error: "Invalid token." })
		}
	},
	followUser: async (req, res) => {
		let followerId = req.user._id;
		const followingId = req.params.id;
		let existingFollow = await Follow.findOne({ followerId, followingId });
        if (existingFollow) {
            await Follow.findByIdAndDelete(existingFollow._id);
            return res.json({ "message": "User followed" });
        }
		let follow = await Follow.create({
			followerId: followerId,
			followingId: followingId
		});
		return res.status(200).json({
			"message": `Followed user ${follow.followingId}`
		});
	},
	changeFullname: async (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) return res.json(errors);
		let user = await User.findOne({ _id: req.user._id });
		user.fullname = req.body.fullname;
		await user.save();
		return res.status(200).json({ Message: "Fullname was changed successfully!" });
	},
	changeEmail: async (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) return res.json(errors);
		let user = await User.findOne({ _id: req.user._id });
		user.email = req.body.email;
		await user.save();
		return res.status(200).json({ Message: "Email was changed successfully!" });
	},
	logout: async (req, res) => {
		let user = await User.findOne({ _id: req.user._id });
		user.accesstoken = "";
		user.refreshtoken = "";
		await user.save();
		return res.status(200).json({ Message: "Successfully logged out." });
	}
}

module.exports = controllers;