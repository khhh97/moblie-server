// 全局错误处理
module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (error) {
      // 触发框架的error事件，记录一天错误日志
      ctx.app.emit('error', error, ctx);

      const status = error.status || 500;
      // 对于线上环境返回信息为Internal Server Error，避免返回铭感信息
      const message = ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : error.message
          ? error.message
          : '服务器出现错误，请稍后重试!';
      ctx.body = {
        code: status,
        msg: message,
        data: error.errors || ''
      };
      ctx.status = status;
    }
  };
};
