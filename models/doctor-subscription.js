const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const Doctor = require("./doctor");

const Subscription = sequelize.define(
  "subscription",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      references: {
        model: Doctor,
        key: "id",
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);



module.exports = Subscription;
