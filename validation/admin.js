const { body } = require("express-validator");
const Account = require("../models/account");

exports.replyToMessageValiadion = [
  body("reply", "Enter a valid reply.").trim().isLength({ min: 3, max: 255 }),
];

exports.addAdminValiadion = [
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
  body("phone", "Enter a valid phone number.")
    .trim()
    .matches(/^01[0125][0-9]{8}$/),
];
