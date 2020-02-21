const { tableConfig, getTableAttributes } = require('./base');

// 文章浏览历史表
module.exports = app => {
  const { INTEGER } = app.Sequelize;

  const History = app.model.define(
    'history',
    getTableAttributes(app.Sequelize, {
      article_id: {
        type: INTEGER,
        allowNull: false,
        comment: '浏览文章id'
      },
      user_id: {
        type: INTEGER,
        comment: '浏览者用户id'
      },
      times: {
        type: INTEGER,
        defaultValue: 1,
        comment: '该用户对此文章的浏览次数'
      }
    }),
    tableConfig
  );

  return History;
};
