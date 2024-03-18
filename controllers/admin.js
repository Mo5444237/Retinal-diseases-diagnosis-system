const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const Contact = require("../models/contact");
const Admin = require("../models/admin");
const Account = require("../models/account");

exports.getMessages = async (req, res, next) => {
  const queryObject = {};
  const filters = req.query;

  if (filters.searchTerm) {
    queryObject[Op.or] = [
      { title: { [Op.iLike]: `%${searchTerm}%` } },
      { description: { [Op.iLike]: `%${searchTerm}%` } },
    ];
  }

  if (filters.status) {
    queryObject.status = filters.status;
  }

  const page = parseInt(filters.page, 10) || 1;
  const pageSize = parseInt(filters.pageSize, 10) || 10;
  const skip = (page - 1) * pageSize;
  try {
    const messages = await Contact.findAll({
      where: queryObject,
      limit: pageSize,
      offset: skip,
    });
    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

exports.getMessageDetails = async (req, res, next) => {
  const messageId = req.params.messageId;
  try {
    const message = await Contact.findByPk(messageId);
    if (!message) {
      const error = new Error("Message not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

exports.sendReply = async (req, res, next) => {
  const { messageId, reply } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const message = await Contact.findByPk(messageId);
    if (!message) {
      const error = new Error("Message not found.");
      error.statusCode = 404;
      throw error;
    }
    message.status = "done";
    message.reply = reply;
    res.status(201).json({ message: "Reply sent successfully." });
  } catch (error) {
    next(error);
  }
};

exports.getAdmins = async (req, res, next) => {
  const queryObject = { degree: "admin" };
  const filters = req.query;

  if (filters.searchTerm) {
    queryObject.name = { [Op.iLike]: `%${searchTerm}%` };
  }

  try {
    const adminDegree = req.adminDegree;

    if (adminDegree !== "manager") {
      const error = new Error("Un-authorized");
      error.statusCode = 403;
      throw error;
    }

    const admins = await Admin.findAll({
      where: queryObject,
    });
    res.status(200).json({ admins });
  } catch (error) {
    next(error);
  }
};

exports.getAdminDetails = async (req, res, next) => {
  const adminId = req.params.adminId;
  try {
    const adminDegree = req.adminDegree;

    if (adminDegree !== "manager") {
      const error = new Error("Un-authorized");
      error.statusCode = 403;
      throw error;
    }
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      const error = new Error("Admin not found.");
      error.statusCode = 404;
      throw error;
    }

    const adminAccount = await Account.findByPk(admin.accountId, {
      attributes: {
        exclude: ["id", "password"],
      },
    });

    res
      .status(200)
      .json({ admin: { ...admin.dataValues, ...adminAccount.dataValues } });
  } catch (error) {
    next(error);
  }
};

exports.addAdmin = async (req, res, next) => {
  const adminData = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const adminDegree = req.adminDegree;

    if (adminDegree !== "manager") {
      const error = new Error("Un-authorized.");
      error.statusCode = 403;
      throw error;
    }

    const hasedPassword = await bcrypt.hash(adminData.password, 12);

    const newAdminAccount = await Account.create({
      email: adminData.email,
      password: hasedPassword,
      role: "admin",
    });

    let newAdmin;
    if (newAdminAccount) {
      newAdmin = await Admin.create({
        accountId: newAdminAccount.id,
        name: adminData.name,
        phone: adminData.phone,
        degree: "admin",
      });
    }

    res
      .status(201)
      .json({ message: "Admin created successfully.", admin: newAdmin });
  } catch (error) {
    next(error);
  }
};

exports.deleteAdmin = async (req, res, next) => {
  const adminId = req.body.adminId;
  try {
    const adminDegree = req.adminDegree;

    if (adminDegree !== "manager") {
      const error = new Error("Un-authorized.");
      error.statusCode = 403;
      throw error;
    }

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      const error = new Error("Admin not found");
      error.statusCode = 404;
      throw error;
    }
    await admin.destroy();
    await Account.destroy({
      where: {
        id: admin.accountId,
      },
    });

    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    next(error);
  }
};
