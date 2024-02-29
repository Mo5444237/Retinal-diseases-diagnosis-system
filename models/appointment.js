const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Appointment = sequelize.define("Appointment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    prescription: {
        type: DataTypes.STRING,
    }
});

module.exports = Appointment;
