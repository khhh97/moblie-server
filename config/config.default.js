module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'mobile-server';

  // add your middleware config here
  config.middleware = ['notfoundHandler', 'errorHandler', 'authorization'];

  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  // csrf配置
  config.security = {
    csrf: {
      ignore: () => true
    }
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

  // 上传文件配置
  config.multipart = {
    mode: 'file'
  };

  // add your user config here
  const userConfig = {
    qiniu: {
      accessKey: '',
      secretKey: '',
      template_id: ''
    },
    // 腾讯云短信配置
    qCloudSms: {
      appid: '',
      appkey: '',
      templateId: '',
      smsSign: ''
    },
    oss: {
      region: '',
      accessKeyId: '',
      accessKeySecret: '',
      bucket: ''
    },
    robot: {
      key: '',
      url: ''
    },
    token: {
      secret: 'mobile',
      // 过期时间为 7天
      expired: '7d',
      whiteRouter: [
        '/api/verify',
        '/api/login',
        '/api/topics',
        '/api/user/profile',
        '/api/follows',
        '/api/fans',
        { method: 'get', url: '/api/article' },
        '/api/article/list',
        { method: 'get', url: '/api/comment' },
        '/api/suggest'
      ]
    }
  };

  return {
    ...config,
    ...userConfig
  };
};
