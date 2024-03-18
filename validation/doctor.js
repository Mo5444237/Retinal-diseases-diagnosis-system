const { body } = require("express-validator");

exports.editProfileValidation = [
  body("name", "Enter a valid name.")
    .optional()
    .trim()
    .matches(
      /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/
    ),
  body("DOB")
    .optional()
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
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }),
  body("phone", "Enter a valid phone number.")
    .optional()
    .trim()
    .matches(/^01[0125][0-9]{8}$/),
];

exports.postScheduleValidation = [
  body("day")
    .trim()
    .custom((value, { req }) => {
      const days = [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ];
      return days.includes(value);
    }),
  body("startTime", "Select a valid time.")
    .trim()
    .matches(/([01]?[0-9]|2[0-3]):[0,3][0]/),
  body("endTime", "Select a valid time.")
    .trim()
    .matches(/([01]?[0-9]|2[0-3]):[0,3][0]/)
    .custom((value, { req }) => {
      const startTime = req.body.startTime.slice(0, 2);
      const endTime = req.body.endTime.slice(0, 2);

      if (endTime < startTime) {
        return Promise.reject("Enter a valid range.");
      }
      return startTime;
    }),
];

exports.writePrescriptionValidation = [
  body("prescription", "Prescription within 3 to 255 charaters")
    .trim()
    .isLength({ min: 3, max: 255 }),
];
