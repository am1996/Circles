const { body } = require('express-validator');
const User = require('../models/User');

const validators = {
    registerUserValidator: [
        body("fullname").isLength({min:3,max:100}).withMessage("Enter a valid fullname with length between 3 and 100 characters."),
        body("email").isEmail().withMessage("This is not a valid E-Mail."),
        body("email").custom((value)=>{
            return User.findOne({ email: value }).then((user) => {
                if (user) {
                  return Promise.reject('Email already in use');
                }
            });
        }).withMessage("The email is already registered."),
        body("password").isLength({min:8,max:400}).matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\.@]+/, 'gi').
        withMessage("Password should be more than 8 characters with alphanumeric and uppercase."),
        body("repeatpassword").custom((value,{req})=>{
            if(value != req.body.password) throw Error("Password and Repeat Password don't match.")
            return true;
        }),
    ],
    loginUserValidator: [
        body("email").isEmail().withMessage("This is not a valid E-Mail form."),
        body("password").isLength({min:8,max:400}).matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\.@]+/, 'gi').
        withMessage("Password should be more than 8 characters with alphanumeric and uppercase."),
    ],
    changePasswordValidator: [
        body("password").isLength({min:8,max:400}).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/, 'i').
        withMessage("Password should be more than 8 characters with alphanumeric and uppercase."),
        body("newpassword").isLength({min:8,max:400}).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/, 'i').
        withMessage("Password should be more than 8 characters with alphanumeric and uppercase."),
    ],
    changeFullnameValidator: [
        body("fullname").isLength({min:3,max:100}).withMessage("Enter a valid fullname with length between 3 and 100 characters."),
    ],
    changeEmailValidator: [
        body("email").isEmail().withMessage("This is not a valid E-Mail."),
        body("email").custom((value)=>{
            return User.findOne({ email: value }).then((user) => {
                if (user) {
                  return Promise.reject('Email already in use');
                }
            });
        }).withMessage("The email is already registered."),
    ],
};

module.exports = validators;