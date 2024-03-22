const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Contact = sequelize.define(
  "Contact",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.UUID,
      references: {
        model: "Account",
        key: "id",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    response: {
      type: DataTypes.STRING,
    },
  },
  { createdAt: true, timestamps: false }
);


module.exports = Contact;
