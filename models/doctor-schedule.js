const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Schedule = sequelize.define("Schedule", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  day: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

module.exports = Schedule;
