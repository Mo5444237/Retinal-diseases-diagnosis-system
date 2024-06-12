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
  body("name", "Enter a valid name.")
    .trim()
    .matches(
      /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/
    ),
  body("DOB")
    .trim()
    .custom((value, { req }) => {
      const DOB = new Date(value).getFullYear();
      const currentDate = new Date().getFullYear();

      const age = currentDate - DOB;

      if (age < 18 || age > 80) {
        return Promise.reject("The age has to be within 18 to 80 years.");
      }
      return DOB;
    }),
  body("address", "Enter a valid address")
    .trim()
    .isLength({ min: 3, max: 255 }),
  body("phone", "Enter a valid phone number.")
    .trim()
    .matches(/^01[0125][0-9]{8}$/),
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

exports.resetPasswordValidation = [
  body("email", "Enter a valid email").trim().isEmail().normalizeEmail(),
];

exports.contactValidation = [
  body("title", "Enter a valid title").trim().notEmpty(),
  body("description", "Enter a detailed decription.")
    .trim()
    .isLength({ min: 8, max: 255 }),
];
