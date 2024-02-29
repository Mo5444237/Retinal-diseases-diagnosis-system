const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Subscription = sequelize.define("Subscription", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
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
});

module.exports = Subscription;
