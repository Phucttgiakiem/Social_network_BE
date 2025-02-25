'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, { foreignKey: 'UserID', as: 'Post' });
      User.hasMany(models.Comment,{ foreignKey: 'UserID', as: 'Comments'});
      User.hasMany(models.Likepost,{ foreignKey: 'UserID', as: 'likes' });
    }
  };
  User.init({
    email:DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    fullName:DataTypes.STRING,
    dateofbirth:DataTypes.DATE,
    address:DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    avatar:DataTypes.STRING,
    Bio:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    
  });
  return User;
};