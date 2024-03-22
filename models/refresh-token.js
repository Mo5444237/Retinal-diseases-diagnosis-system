const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    accountId: {
      type: DataTypes.UUID,
      references: {
        model: "Account",
        key: "id",
      },
    },
  },
  { timestamps: false }
);

module.exports = RefreshToken;
