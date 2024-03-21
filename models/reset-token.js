const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const Account = require("./account");

const ResetToken = sequelize.define(
  "resetToken",
  {
    accountId: {
      type: DataTypes.UUID,
      references: {
        model: Account,
        key: "id",
      },
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = ResetToken;
