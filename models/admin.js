const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const Account = require("./account");

const Admin = sequelize.define(
  "admin",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.INTEGER,
      references: {
        model: Account,
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);


module.exports = Admin;
