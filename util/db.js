const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  dialectModule: require("pg"),
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: process.env.DATABASE_CERTIFICATE,
    },
  },
  define: {
    freezeTableName: true,
  },
  logging: false,
});


// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// }

// testConnection();

module.exports = sequelize;
