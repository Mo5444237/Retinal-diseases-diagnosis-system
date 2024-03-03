const { body } = require("express-validator");
const Account = require("../models/account");

exports.signupValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a vaild email.")
    .custom(async (value, { req }) => {
      const user = await Account.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject("E-mail address already exists.");
      }
      return user;
    })
    .normalizeEmail(),

  body(
    "password",
    "Enter a password with minimum length of 8, at least 1 lowerCase character, at least 1 upperCase character"
  )
    .trim()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),

  body("passwordConfirmation", "Passwords have to match.")
    .trim()
    .custom((value, { req }) => value === req.body.password),
];

exports.loginValidation = [
  body("email", "Enter a valid email").trim().isEmail().normalizeEmail(),
  body("password", "Enter your password").trim().not().isEmpty(),
];


exports.changePasswordValidation = [
  body(
    "password",
    "Enter a password with minimum length of 8, at least 1 lowerCase character, at least 1 upperCase character"
  )
    .trim()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),

  body("passwordConfirmation", "Passwords have to match.")
    .trim()
    .custom((value, { req }) => value === req.body.password),
];