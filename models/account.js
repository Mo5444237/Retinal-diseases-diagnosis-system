const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Account = sequelize.define("account", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
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
}, {timestamps: false});


module.exports = Account;
