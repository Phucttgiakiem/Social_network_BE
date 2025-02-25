const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.PASSMYSQL, {
  host: process.env.HOST,  // Host từ Railway
  port: process.env.POST,                        // Port từ Railway
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
module.exports = connectDB;