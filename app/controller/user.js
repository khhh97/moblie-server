/* eslint-disable jsdoc/check-param-names */
const { Controller } = require('egg');
const uuidv4 = require('uuid/v4');

class UserController extends Controller {
  /**
   * @description 用户登录，未注册用户登录的同时注册
   * @param {String} phone - 手机号
   * @param {String} verify - 验证码
   */
  async login() {
    const { ctx } = this;
    const { phone, verify, platform } = ctx.request.body;

    // 校验手机号码
    const validateResult = ctx.helper.validatePhone(ctx, phone);
    if (Object.keys(validateResult).length > 0) {
      ctx.body = validateResult;
      return false;
    }
    // 校验验证码不为空
    if (!verify) {
      ctx.body = { code: 400, msg: '请填写验证码!', data: '' };
      return;
    }
    // 平台参数空校验
    ctx.validate(
      {
        platform: {
          type: 'string',
          required: true
        }
      },
      ctx.request.body
    );

    // 查询当前用户是否存在
    let user = await ctx.model.User.findUserByPhoneNumber(phone);
    // let verifyInfo = {};

    // 获取验证码信息，查询验证码是否存在，校验过期时间
    const verifyModel = user ? 'User' : 'Verify';
    const verifyInfo = await ctx.model[verifyModel].findOne({
      where: { phone, verify_code: verify }
    });

    if (!verifyInfo) {
      ctx.body = { code: 400, msg: '验证码错误，请重新输入!', data: '' };
      return;
    }

    const now = Date.now();
    // 检查时间是否过期
    if (now > Number(verifyInfo.verify_expire)) {
      ctx.body = {
        code: 400,
        msg: '验证码已过期，请重新获取验证码!',
        data: ''
      };
      return;
    }

    // 根据用户信息生成token返回
    let newUser = false;
    if (!user) {
      newUser = true;
      user = await ctx.model.User.create({
        nickname: `用户${uuidv4().substring(0, 8)}`,
        phone,
        verify_code: verifyInfo.verify_code,
        verify_expire: verifyInfo.verify_expire
      });
    }
    const token = ctx.helper.generateToken(ctx, { user_id: user.id, phone });
    // 更新token数据库
    if (newUser) {
      await ctx.model.Token.create({
        user_id: user.id,
        [platform]: token
      });
    } else {
      await ctx.model.Token.update(
        {
          [platform]: token
        },
        {
          where: { user_id: user.id }
        }
      );
    }

    ctx.body = {
      code: 200,
      msg: '',
      data: {
        token
      }
    };
  }

  /**
   * @description 发送验证码
   * @param {String} phone - 手机号码  required
   */
  async sendVerifyCode() {
    const { ctx } = this;
    const { phone } = ctx.request.body;
    // 校验手机号码
    const validateResult = ctx.helper.validatePhone(ctx, phone);
    if (Object.keys(validateResult).length > 0) {
      ctx.body = validateResult;
      return false;
    }

    // 查询当前用户是否存在
    const hasUser = await ctx.model.User.findUserByPhoneNumber(phone);
    // 验证码过期时间15分钟
    // const VERIFY_EXPIRE_TIME = Date.now() + 1000 * 60 * 15;
    const VERIFY_EXPIRE_TIME = Date.now() + 1000 * 60 * 60 * 24 * 7;
    // 验证码
    const verify = ctx.helper.generateVerify();
    const sendVerifyRes = await ctx.service.common.sendQiNiuMsg(
      ctx,
      verify,
      phone
    );
    // 短信验证码发送失败
    if (sendVerifyRes.code !== 200) {
      ctx.body = sendVerifyRes;
      return false;
    }

    if (hasUser) {
      // 如果用户存在
      await ctx.model.User.update(
        {
          verify_code: verify,
          verify_expire: VERIFY_EXPIRE_TIME
        },
        {
          where: { phone }
        }
      );
    } else {
      // 查询是否已存在该手机号码的记录,存在修改值，不存在新增一条数据
      const hasRecord = await ctx.model.Verify.findOne({
        where: { phone }
      });
      if (hasRecord) {
        // 修改信息
        await ctx.model.Verify.update(
          {
            verify_code: verify,
            verify_expire: VERIFY_EXPIRE_TIME
          },
          {
            where: { phone }
          }
        );
      } else {
        // 在验证码表中添加一条数据;
        await ctx.model.Verify.create({
          verify_code: verify,
          verify_expire: VERIFY_EXPIRE_TIME,
          phone
        });
      }
    }

    ctx.body = sendVerifyRes;
  }

  /**
   * @description 获取用户信息
   */
  async getMyInfo() {
    const { ctx } = this;
    const { id } = ctx.request.user;
    const user = await ctx.model.User.findOne({
      where: { id },
      attributes: [
        'id',
        'nickname',
        'phone',
        'avatar',
        'job',
        'gender',
        'birth',
        'bio'
      ]
    });
    // 获取关注总数
    const {
      fans_count,
      follow_count,
      article_count
    } = await ctx.service.user.getUserAllCount(ctx, id);
    user.dataValues.follow_count = follow_count;
    user.dataValues.fans_count = fans_count;
    user.dataValues.article_count = article_count;

    ctx.body = {
      code: 200,
      msg: '',
      data: user
    };
  }

  /**
   * @description 获取个人主页的用户信息
   */
  async getUserInfo() {
    const { ctx } = this;
    const userId = ctx.request.body.id;

    if (!userId) {
      ctx.helper.fail(ctx, '缺少必要参数用户id');
      return;
    }

    const user = await ctx.model.User.findOne({
      where: { id: userId },
      attributes: ['id', 'nickname', 'phone', 'avatar', 'job', 'bio']
    });

    // 获取关注总数
    const {
      fans_count,
      follow_count,
      article_count
    } = await ctx.service.user.getUserAllCount(ctx, userId);
    user.dataValues.follow_count = follow_count;
    user.dataValues.fans_count = fans_count;
    user.dataValues.article_count = article_count;
    user.dataValues.follow_count = follow_count;
    user.dataValues.fans_count = fans_count;

    ctx.body = {
      code: 200,
      msg: '',
      data: user
    };
  }

  /**
   * @description 更新用户信息
   */
  async updateUserInfo() {
    const { ctx } = this;
    const { nickname, bio, gender, birth, job } = ctx.request.body;
    const user = { nickname, bio, gender, birth, job };
    for (const key in user) {
      if (!user[key]) delete user[key];
    }
    if (Object.keys(user).length === 0) {
      ctx.body = {
        code: 400,
        msg: '无任何操作',
        data: ''
      };
      return;
    }
    ctx.validate(
      {
        nickname: {
          type: 'string',
          required: false,
          max: 20
        },
        bio: {
          type: 'string',
          required: false,
          max: 100
        },
        gender: {
          type: 'enum',
          required: false,
          values: ['男', '女']
        },
        birth: {
          type: 'string',
          required: false
        },
        job: {
          type: 'string',
          required: false,
          max: 15
        }
      },
      user
    );
    // 更新数据库
    console.log(user);
    await ctx.model.User.update(user, {
      where: { id: ctx.request.user.id }
    });
    ctx.body = {
      code: 200,
      msg: '',
      data: ''
    };
  }

  /**
   * @description 修改头像
   */
  async updateUserAvatar() {
    const { ctx } = this;
    const result = await ctx.service.common.uploadSingleFile(ctx);
    if (result.code === 200) {
      // 更新用户信息
      await ctx.model.User.update(
        {
          avatar: result.data
        },
        {
          where: { id: ctx.request.user.id }
        }
      );
    }

    ctx.body = result;
  }
}

module.exports = UserController;
