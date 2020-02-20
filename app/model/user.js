const { tableConfig, getTableAttributes } = require('./base');

module.exports = app => {
  const { STRING, ENUM } = app.Sequelize;

  const User = app.model.define(
    'user',
    getTableAttributes(app.Sequelize, {
      nickname: {
        type: STRING,
        comment: '用户昵称'
      },
      phone: {
        type: STRING,
        allowNull: false,
        comment: '手机号'
      },
      avatar: {
        type: STRING,
        defaultValue:
          'https://khhh97.oss-cn-beijing.aliyuncs.com/mobile/defaultAvatar.jpg'
      },
      verify_code: {
        type: STRING,
        comment: '验证码'
      },
      verify_expire: {
        type: STRING,
        comment: '验证码过期时间'
      },
      gender: {
        type: ENUM('男', '女'),
        comment: '性别'
      },
      birth: {
        type: STRING,
        comment: '出生日期'
      },
      job: {
        type: STRING,
        comment: '职位，认证信息'
      },
      bio: {
        type: STRING,
        comment: '个人简介'
      }
      // fans_count: {
      //   type: INTEGER,
      //   defaultValue: 0,
      //   comment: '粉丝数量'
      // },
      // follow_count: {
      //   type: INTEGER,
      //   defaultValue: 0,
      //   comment: '关注数量'
      // },
      // praise_count: {
      //   type: INTEGER,
      //   defaultValue: 0,
      //   comment: '获赞数量'
      // },
      // dynamic_count: {
      //   type: INTEGER,
      //   defaultValue: 0,
      //   comment: '动态数量'
      // }
    }),
    tableConfig
  );

  // 根据手机号码查找用户
  User.findUserByPhoneNumber = async function(phone) {
    return await this.findOne({ where: { phone } });
  };

  return User;
};
