const { tableConfig, getTableAttributes } = require('./base');

module.exports = app => {
  const { INTEGER } = app.Sequelize;

  const Fans = app.model.define(
    'fans',
    getTableAttributes(app.Sequelize, {
      user_id: {
        type: INTEGER,
        allowNull: true,
        comment: '被粉用户ID'
      },
      follower: {
        type: INTEGER,
        allowNull: true,
        comment: '粉丝用户id'
      }
    }),
    tableConfig
  );

  return Fans;
};
