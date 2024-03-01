const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Attachment = sequelize.define(
  "attachment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);


module.exports = Attachment;
