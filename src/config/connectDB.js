const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('railway', 'root', 'cXWtUZQyJHHdnZzvzCKyhkorrUOskWSN', {
  host: 'turntable.proxy.rlwy.net',  // Host từ Railway
  port: 17737,                        // Port từ Railway
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