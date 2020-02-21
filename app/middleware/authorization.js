// token认证校验
module.exports = () => {
  return async function authorization(ctx, next) {
    let { whiteRouter } = ctx.app.config.token;
    const path = ctx.request.path;
    const method = ctx.request.method.toLowerCase();
    whiteRouter = whiteRouter.filter(item => {
      if (typeof item === 'object') {
        return item.method.toLowerCase() === method && path === item.url;
      }
      return item === path;
    });
    if (whiteRouter.length === 0) {
      const { token, platform } = ctx.request.header;
      // token为空
      if (!token) {
        ctx.body = {
          code: 40000,
          msg: '令牌为空,请重新登录获取',
          data: ''
        };
        return;
      }
      // platform为空
      if (!platform) {
        ctx.body = {
          code: 40000,
          msg: '未知平台,请在正确的平台使用',
          data: ''
        };
        return;
      }
      try {
        const user = await ctx.helper.validateToken(ctx, token);
        // 数据库查询
        const result = await ctx.model.Token.findOne({
          where: { user_id: user.user_id, [platform]: token }
        });
        if (!result) {
          ctx.body = {
            code: 40000,
            msg: '令牌已失效,请重新登录获取',
            data: ''
          };
          return;
        }
        ctx.request.user = { id: user.user_id, phone: user.phone };
      } catch (error) {
        ctx.body = {
          code: 401,
          msg: 'Unauthorization',
          data: ''
        };
        return;
      }
      await next();
    } else {
      await next();
    }
  };
};
