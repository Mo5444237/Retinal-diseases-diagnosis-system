const express = require("express");
const {
  signup,
  login,
  changePassword,
  refreshToken,
  sendOTP,
  resetPassword,
  logout,
} = require("../controllers/auth");
const {
  signupValidation,
  loginValidation,
  changePasswordValidation,
  resetPasswordValidation,
} = require("../validation/auth");
const isAuth = require("../middlewares/is-auth");
const router = express.Router();

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.get("/refresh-token", refreshToken);
router.post(
  "/change-password",
  isAuth,
  changePasswordValidation,
  changePassword
);
router.post("/reset-token", resetPasswordValidation, sendOTP);
router.put("/reset-password", changePasswordValidation, resetPassword);
router.post("/logout", logout);

module.exports = router;
