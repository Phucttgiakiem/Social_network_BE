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
/* 'use strict';

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connectDB'; 
// 👆 import CHUNG sequelize, KHÔNG new Sequelize() nữa

const Post = sequelize.define(
  'Post',
  {
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    Content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    MediaType: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    MediaURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    Timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    Formatvideo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    Hashtabvideo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    Namemusicvideo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Posts',      // 👈 đúng tên table trong DB
    timestamps: false,       // 👈 nếu table KHÔNG có createdAt / updatedAt
    freezeTableName: true,   // 👈 tránh Sequelize tự đổi tên table
  }
); */

/* ================== ASSOCIATIONS ================== */
/* Post.associate = (models) => {
  Post.belongsTo(models.User, {
    foreignKey: 'UserID',
    as: 'User',
  });

  Post.hasMany(models.Likepost, {
    foreignKey: 'PostId',
    as: 'likes',
  });

  Post.hasMany(models.Comment, {
    foreignKey: 'PostID',
    as: 'comments',
  });
};

module.exports = Post;
 */