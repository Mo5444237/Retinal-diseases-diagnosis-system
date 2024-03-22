const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("patient", "doctor", "admin"),
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Account;
