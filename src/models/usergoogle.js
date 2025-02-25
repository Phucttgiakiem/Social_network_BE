'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usergoogle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Usergoogle.init({
    sub:DataTypes.STRING,
    email:DataTypes.STRING,
    name:DataTypes.STRING,
    avatar:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usergoogle',
    tableName: 'usergoogle'
  });
  return Usergoogle;
};