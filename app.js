module.exports = app => {
  // app.beforeStart(async () => {
  //   // 初始化同步数据库同步
  //   await app.model.sync({ alter: true });
  //   console.log('数据库同步成功!');
  // });

  if (app.config.env === 'local' || app.config.env === 'unittest') {
    app.beforeStart(async () => {
      await app.model.sync({ force: false });
      console.log('数据库同步成功!');
    });
  }
};
