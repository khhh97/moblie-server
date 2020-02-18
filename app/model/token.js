const { tableConfig, getTableAttributes } = require('./base');

// 各平台token对照表
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Token = app.model.define(
    'token',
    getTableAttributes(app.Sequelize, {
      user_id: {
        type: INTEGER,
        comment: 'token对于用户id'
      },
      weapp: {
        type: STRING,
        comment: '微信小程序token'
      },
      web: {
        type: STRING,
        comment: 'WEB(H5)token'
      },
      swan: {
        type: STRING,
        comment: '百度小程序token'
      },
      alipay: {
        type: STRING,
        comment: '支付宝小程序token'
      },
      tt: {
        type: STRING,
        comment: '字节跳动小程序token'
      },
      rn: {
        type: STRING,
        comment: 'ReactNative token'
      },
      quickapp: {
        type: STRING,
        comment: '快应用环境token'
      },
      qq: {
        type: STRING,
        comment: 'QQ小程序token'
      },
      jd: {
        type: STRING,
        comment: '京东小程序token'
      }
    }),
    tableConfig
  );

  return Token;
};
