const { Controller } = require('egg');

class RobotController extends Controller {
  async sendMsg() {
    const { ctx } = this;
    const { question } = ctx.request.body;

    if (!question) {
      ctx.helper.fail(ctx, '请输入查询内容!');
      return;
    }

    // 接入接口
    const url = 'http://i.itpk.cn/api.php';
    const requestBody = {
      question,
      api_key: '81c13f4620f17c05d120556a92bb934d',
      api_secret: 'bl92eutrfmkt',
      limit: 5
    };
    let result = {};
    try {
      result = await ctx.curl(url, {
        method: 'GET',
        data: requestBody,
        dataType: 'text'
      });
    } catch (error) {
      ctx.helper.fail(ctx, error.message || '网络请求超时,请重新发送');
      return;
    }

    let data = result.data;
    data = ctx.helper.ascii2String(data);
    if (data) console.log(typeof data);
    console.log(data);
    ctx.helper.success(ctx, data, result.status);
  }
}

module.exports = RobotController;
