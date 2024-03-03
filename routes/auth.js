const express = require('express');
const { signup, login, changePassword, refreshToken } = require('../controllers/auth');
const { signupValidation, loginValidation, changePasswordValidation } = require('../validation/auth');
const isAuth = require('../middlewares/is-auth');
const router = express.Router();


router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get("/refresh-token", refreshToken);
router.post("/change-password", isAuth, changePasswordValidation, changePassword);


module.exports = router;