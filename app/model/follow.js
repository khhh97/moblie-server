const { tableConfig, getTableAttributes } = require('./base');

// 关注关系表
module.exports = app => {
  const { INTEGER, ENUM } = app.Sequelize;

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
      },
      status: {
        type: ENUM('0', '1', '2'),
        comment: '关注状态 0：关注中，1:取消关注,2：互相关注'
      }
    }),
    tableConfig
  );

  return Follow;
};
