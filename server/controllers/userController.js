const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Utils = require("../Utils/JWTUtils");

let controllers = {
}

module.exports = controllers;