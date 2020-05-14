const { Controller } = require('egg');
const queryString = require('querystring');

class CommonController extends Controller {
  // 上传文件,支持多文件与单文件上传，需认证token上传
  async uploadFile() {
    const { ctx } = this;
    ctx.body = await ctx.service.common.uploadFile(ctx);
  }

  // http代理
  async httpMiddleware() {
    const baseUrl = 'https://aip.baidubce.com';
    const { ctx } = this;
    const body = ctx.request.body;
    const query = ctx.query;
    const method = ctx.method;
    const { target } = ctx.request.header;

    if (!target) {
      ctx.helper.fail(ctx, '请在请求头中携带请求地址');
      return false;
    }

    if (query && !query.url) {
      ctx.helper.fail(ctx, '请携带请求参数');
      return false;
    }
    let url = baseUrl + query.url;
    delete query.url;

    // 发请求
    const options = { method, dataType: 'json' };
    if (Object.keys(query).length > 0) {
      url = url + '?' + queryString.stringify(query);
    }
    if (
      body &&
      method.toUpperCase() === 'POST' &&
      Object.keys(body).length > 0
    ) {
      options.data = body;
    }

    try {
      const result = await ctx.curl(url, options);
      const { status, res } = result;

      if (status !== 200) {
        ctx.helper.fail(ctx, '请求失败,请重试');
        return false;
      }

      if (res.data && res.data.error_code) {
        ctx.helper.fail(ctx, res.data.error_msg || '请求失败,请重试');
        return false;
      }

      ctx.helper.success(ctx, res.data);
    } catch (error) {
      ctx.helper.fail(ctx, '请求失败,请重试');
    }
  }
}

module.exports = CommonController;
