const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const Account = require("./account");

const RefreshToken = sequelize.define(
  "refreshToken",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    accountId: {
      type: DataTypes.UUID,
      references: {
        model: Account,
        key: "id",
      },
    },
  },
  { timestamps: false }
);

module.exports = RefreshToken;
