const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "postgres",
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        dialect: "postgres",
        host: "localhost",
    }
);

module.exports = sequelize;
