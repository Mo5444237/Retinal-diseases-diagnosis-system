const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const ResetToken = sequelize.define(
  "ResetToken",
  {
    accountId: {
      type: DataTypes.UUID,
      references: {
        model: "Account",
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
