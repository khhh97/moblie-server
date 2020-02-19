const { tableConfig, getTableAttributes } = require('./base');

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Verify = app.model.define(
    'verify',
    getTableAttributes(app.Sequelize, {
      verify_code: {
        type: INTEGER,
        allowNull: false,
        comment: '验证码'
      },
      verify_expire: {
        type: STRING,
        allowNull: false,
        comment: '验证码过期时间'
      },
      phone: {
        type: STRING,
        allowNull: false,
        comment: '手机号'
      }
    }),
    tableConfig
  );

  return Verify;
};
