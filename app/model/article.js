const { tableConfig, getTableAttributes } = require('./base');

module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const Article = app.model.define(
    'article',
    getTableAttributes(app.Sequelize, {
      title: {
        type: STRING,
        allowNull: false,
        comment: '文章标题'
      },
      content: {
        type: TEXT,
        allowNull: false,
        comment: '文章正文'
      },
      img1_url: {
        type: STRING,
        comment: '文章图片1'
      },
      img2_url: {
        type: STRING,
        comment: '文章图片2'
      },
      img3_url: {
        type: STRING,
        comment: '文章图片3'
      },
      video_url: {
        type: STRING,
        comment: '视频地址，预留字段'
      },
      post_id: {
        type: INTEGER,
        comment: '发表文章用户id'
      },
      topic_id: {
        type: STRING,
        allowNull: false,
        comment: '对应的主题key值'
      },
      browse_count: {
        type: INTEGER,
        defaultValue: 0,
        comment: '浏览历史总数'
      }
    }),
    tableConfig
  );

  return Article;
};
