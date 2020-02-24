const { tableConfig, getTableAttributes } = require('./base');

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Robot = app.model.define(
    'robot',
    getTableAttributes(app.Sequelize, {
      sender_id: {
        type: INTEGER,
        allowNull: false,
        comment: '发送消息用户id'
      },
      accept_id: {
        type: INTEGER,
        allowNull: false,
        comment: '接受者用户id'
      },
      content: {
        type: STRING,
        allowNull: false,
        comment: '提问与回复内容'
      },
      img_url: {
        type: STRING,
        comment: '消息记录中预留的图片地址'
      }
    }),
    tableConfig
  );

  return Robot;
};
