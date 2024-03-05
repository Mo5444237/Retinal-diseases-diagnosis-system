const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Account = require("../models/account");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../util/generate-token");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");

exports.signup = async (req, res, next) => {
  const { email, password, role, name, DOB, address, phone } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const hasedPassword = await bcrypt.hash(password, 12);
    const user = await Account.create({
      email: email,
      password: hasedPassword,
      role: role || "patient",
    });

    const accountId = user.id;

    console.log(accountId)
    if (role !== "doctor") {
      const patient = await Patient.create({
        accountId: accountId,
        name: name,
        DOB: DOB,
        address: address,
        phone: phone,
      });
    } else if (role === "doctor") {
      const doctor = await Doctor.create({
        accountId: accountId,
        name: name,
        DOB: DOB,
        address: address,
        phone: phone,
      });
    }

    res.status(201).json({ message: "Account created.", userId: user.id });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const user = await Account.findOne({ where: { email: email } });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const accessToken = generateAccessToken(user.id.toString());
    const refreshToken = generateRefreshToken(user.id.toString());

    const userData = user.toJSON();
    delete userData.password;

    // send httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ message: "Logged-in successfully", userData, accessToken });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_KEY
    );

    if (!decoded) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id.toString());

    res.status(201).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {};

exports.changePassword = async (req, res, next) => {
  const { password } = req.body;
  const userId = req.userId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const user = await Account.findByPk(userId);
    const hasedPassword = await bcrypt.hash(password, 12);

    user.password = hasedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
