const { Controller } = require('egg');

class UserController extends Controller {
  // 用户登录
  async login() {
    this.ctx.body = {
      code: 200,
      msg: '',
      data: []
    };
  }

  // 发送验证码
  async sendVerifyCode() {
    const { ctx } = this;
    const { phone } = ctx.request.body;
    // 校验手机号码
    const validateResult = ctx.helper.validatePhone(ctx, phone);
    if (Object.keys(validateResult).length > 0) ctx.body = validateResult;

    // 查询当前用户是否存在
    const hasUser = await ctx.model.User.findUserByPhoneNumber(phone);
    // 验证码过期时间15分钟
    const VERIFY_EXPIRE_TIME = Date.now() + 1000 * 60 * 15;
    // 验证码
    const verify = ctx.helper.generateVerify();
    const sendVerifyRes = await ctx.service.common.sendQiNiuMsg(
      ctx,
      verify,
      phone
    );
    // 短信验证码发送失败
    if (sendVerifyRes.code !== 200) ctx.body = sendVerifyRes;

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
}

module.exports = UserController;
