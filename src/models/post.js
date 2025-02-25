'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: 'UserID', as: 'User' });
      Post.hasMany(models.Likepost, { foreignKey: 'PostId', as: 'likes' }); 
      Post.hasMany(models.Comment, { foreignKey: 'PostID', as: 'comments' });
    }
  };
  Post.init({
    UserID: DataTypes.INTEGER,
    Content: DataTypes.TEXT,
    MediaType: DataTypes.STRING,
    MediaURL: DataTypes.STRING,
    Timestamp: DataTypes.DATE,
    Formatvideo: DataTypes.STRING,
    Hashtabvideo: DataTypes.STRING,
    Namemusicvideo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};