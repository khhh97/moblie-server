const { tableConfig, getTableAttributes } = require('./base');

// 点赞对于表
module.exports = app => {
  const { INTEGER, ENUM } = app.Sequelize;

  const Praise = app.model.define(
    'praise',
    getTableAttributes(app.Sequelize, {
      praised_id: {
        type: INTEGER,
        allowNull: false,
        comment: '对应的作品或评论的id'
      },
      type: {
        type: ENUM('0', '1'),
        allowNull: false,
        comment: '点赞类型  0作品点赞  1 评论点赞'
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        comment: '点赞者用户id'
      }
    }),
    tableConfig
  );

  return Praise;
};
