const { tableConfig, getTableAttributes } = require('./base');

module.exports = app => {
  const { STRING, BOOLEAN } = app.Sequelize;

  const Topic = app.model.define(
    'topic',
    getTableAttributes(app.Sequelize, {
      name: {
        type: STRING,
        comment: '学科主题名'
      },
      key: {
        type: STRING,
        comment: '主题名对应的key值'
      },
      show: {
        type: BOOLEAN,
        comment: '是否展示'
      }
    }),
    tableConfig
  );

  return Topic;
};
