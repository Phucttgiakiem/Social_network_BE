'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.changeColumn('likespost', 'postID', {
        type: Sequelize.STRING,
        allowNull: true 
      }),
      queryInterface.changeColumn('likespost','userID',{
        type: Sequelize.STRING,
        allowNull:true
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.changeColumn('likespost', 'postID', {
        type: Sequelize.INTEGER,
        allowNull: true // hoặc false tùy thuộc vào yêu cầu của bạn
      }),
      queryInterface.changeColumn('likespost', 'userID', {
        type: Sequelize.INTEGER,
        allowNull: true // hoặc false tùy thuộc vào yêu cầu của bạn
      })
    ]);
  }
};
