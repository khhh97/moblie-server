const { tableConfig, getTableAttributes } = require('./base');

// 评论表
module.exports = app => {
  const { INTEGER, TEXT } = app.Sequelize;

  const Comment = app.model.define(
    'comment',
    getTableAttributes(app.Sequelize, {
      compose_id: {
        type: INTEGER,
        comment: '作品id'
      },
      content: {
        type: TEXT,
        allowNull: false,
        comment: '评论内容'
      },
      from_user_id: {
        type: INTEGER,
        allowNull: false,
        comment: '评论用户id'
      }
    }),
    tableConfig
  );

  return Comment;
};
