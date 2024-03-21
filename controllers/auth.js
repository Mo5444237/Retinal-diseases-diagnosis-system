const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const optGenerator = require("otp-generator");
const { validationResult } = require("express-validator");

const Account = require("../models/account");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../util/generate-token");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const { Op } = require("sequelize");
const sendEmail = require("../util/send-email");
const Admin = require("../models/admin");
const RefreshToken = require("../models/refresh-token");
const ResetToken = require("../models/reset-token");

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

    const userRefreshToken = await RefreshToken.create({
      token: refreshToken,
      accountId: user.id.toString(),
    });

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
    const token = await RefreshToken.findOne({
      where: {
        token: refreshToken,
      },
    });

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_KEY
    );

    if (!token || !decoded) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(decoded.userId.toString());

    res.status(201).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

exports.sendOTP = async (req, res, next) => {
  const { email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const user = await Account.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      const error = new Error("User may not exists.");
      error.statusCode = 422;
      throw error;
    }

    const otp = optGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const OTP = await ResetToken.create({
      accountId: user.id,
      code: otp,
      expiryDate: Date.now() + 3600000,
    });

    let userData;
    if (user.role === "patient") {
      userData = await Patient.findOne({
        where: { accountId: user.id },
        attributes: ["name"],
      });
    } else if (user.role === "doctor") {
      userData = await Doctor.findOne({
        where: { accountId: user.id },
        attributes: ["name"],
      });
    } else {
      userData = await Admin.findOne({
        where: { accountId: user.id },
        attributes: ["name"],
      });
    }
    sendEmail({
      to: user.email,
      subject: "Password reset",
      message: `
                <p>Hello, ${userData.name}.</p>
                <p>Reset Password token: <b>${otp}</b></p>
                <p>If you did not make this request then please ignore this email.</p>
            `,
    });
    res.status(201).json({ message: "Token generated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const otp = req.body.otp;
  const newPassword = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const OTP = await ResetToken.findOne({
      where: {
        code: otp,
        expiryDate: { [Op.gt]: new Date() },
      },
    });

    if (!OTP) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 422;
      throw error;
    }

    const user = await Account.findByPk(OTP.accountId);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password reset done." });
  } catch (error) {
    next(error);
  }
};

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

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    user.password = hasedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const token = await RefreshToken.findOne({
      token: refreshToken,
    });

    if (!token) {
      const error = new Error("Refresh token required.");
      error.statusCode = 401;
      throw error;
    }
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};
