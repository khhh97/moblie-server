module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'mobile-server';

  // add your middleware config here
  config.middleware = ['notfoundHandler', 'errorHandler'];

  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  // sequelize配置
  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'mobile_local',
    username: 'root',
    password: 'peng1997',
    timezone: '+08:00',
    exclude: 'base.js',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig
  };
};
