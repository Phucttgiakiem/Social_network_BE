'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('posts', [
      {
        userID: 5,
        content: "Cảm nhận video của tui",
        mediatype: "video",
        mediaURL: "/src/assets/videos/video3.mp4",
        formatvideo: "576*1024",
        hashtabvideo: "#camnhan#thugian",
        namemusicvideo: "noval relast",
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
