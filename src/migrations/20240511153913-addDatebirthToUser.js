'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'dateofbirth', {
      type: Sequelize.DATE, // Sử dụng kiểu dữ liệu DATE thay vì STRING
      allowNull: false,
      defaultValue: Sequelize.fn('NOW') // Đặt giá trị mặc định là ngày giờ hiện tại
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'dateofbirth');
  }
};
