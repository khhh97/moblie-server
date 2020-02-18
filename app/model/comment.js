const { tableConfig, getTableAttributes } = require('./base');

// 评论表
module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

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
      },
      from_user_name: {
        type: STRING,
        allowNull: false,
        comment: '评论人昵称'
      },
      praise_count: {
        type: INTEGER,
        defaultValue: 0,
        comment: '评论点赞数量'
      }
    }),
    tableConfig
  );

  return Comment;
};
