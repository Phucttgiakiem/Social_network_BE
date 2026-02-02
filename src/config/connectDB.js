/* const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,"", {
  host: process.env.HOST,  // Host từ Railway
  port: process.env.PORT,                        // Port từ Railway
  dialect: 'mysql',
  logging: false
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
module.exports = connectDB; */
const { Sequelize } = require("sequelize");
require('dotenv').config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.PASSMYSQL,
  {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "mysql",
    logging: false,

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");
  } catch (error) {
    console.error("Unable to connect to DB:", error);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
