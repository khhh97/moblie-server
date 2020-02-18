module.exports = app => {
  app.beforeStart(async () => {
    // 初始化同步数据库同步
    await app.model.sync({ force: true });
    console.log('数据库同步成功!');
  });
};
