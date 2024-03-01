const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const Account = require("./account");

const Doctor = sequelize.define(
  "doctor",
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
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DOB: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);










module.exports = Doctor;
