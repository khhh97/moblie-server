const { tableConfig, getTableAttributes } = require('./base');

// 关注关系表
module.exports = app => {
  const { INTEGER } = app.Sequelize;

  const Follow = app.model.define(
    'follow',
    getTableAttributes(app.Sequelize, {
      user_id: {
        type: INTEGER,
        allowNull: true,
        comment: '操作者用户id，即本次操作处于粉丝地位的用户ID'
      },
      followed_user_id: {
        type: INTEGER,
        allowNull: true,
        comment: '被关注用户id'
      }
    }),
    tableConfig
  );

  return Follow;
};
