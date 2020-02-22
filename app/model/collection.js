const { tableConfig, getTableAttributes } = require('./base');

module.exports = app => {
  const { INTEGER } = app.Sequelize;

  const Collection = app.model.define(
    'collection',
    getTableAttributes(app.Sequelize, {
      article_id: {
        type: INTEGER,
        allowNull: false,
        comment: '收藏的文章id'
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        comment: '收藏者用户id'
      }
    }),
    tableConfig
  );

  return Collection;
};
