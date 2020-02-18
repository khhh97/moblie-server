// 处理404路由
module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    await next();
    if (ctx.status === 404 && !ctx.body) {
      const { request } = ctx;
      ctx.body = {
        code: 404,
        msg: `Not Found for ${request.method.toUpperCase()} ${request.url}`,
        data: {}
      };
    }
  };
};
