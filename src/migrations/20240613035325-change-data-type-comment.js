'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.changeColumn('comments', 'postID', {
        type: Sequelize.STRING,
        allowNull: true 
      }),
      queryInterface.changeColumn('comments','UserID',{
        type: Sequelize.STRING,
        allowNull:true
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.changeColumn('comments', 'postID', {
        type: Sequelize.INTEGER,
        allowNull: true // hoặc false tùy thuộc vào yêu cầu của bạn
      }),
      queryInterface.changeColumn('comments', 'UserID', {
        type: Sequelize.INTEGER,
        allowNull: true // hoặc false tùy thuộc vào yêu cầu của bạn
      })
    ]);
  }
};
