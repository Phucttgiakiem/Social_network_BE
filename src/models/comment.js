'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User,{ foreignKey: 'UserID', as: 'User'});
      Comment.belongsTo(models.Post, {
        foreignKey: 'PostID', 
        as: 'Post'
    });
    }
  };
  Comment.init({
    PostID:DataTypes.INTEGER,
    UserID: DataTypes.INTEGER,
    Content: DataTypes.TEXT,
    Timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};