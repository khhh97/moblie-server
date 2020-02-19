const { Controller } = require('egg');

class CommonController extends Controller {
  // 上传文件,支持多文件与单文件上传，需认证token上传
  async uploadFile() {
    const { ctx } = this;
    ctx.body = await ctx.service.common.uploadFile(ctx);
  }
}

module.exports = CommonController;
