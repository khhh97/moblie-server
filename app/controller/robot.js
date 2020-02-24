const { Controller } = require('egg');
const { Op } = require('sequelize');

class RobotController extends Controller {
  async sendMsg() {
    // 默认机器人的id为 0
    const { ctx } = this;
    const { question } = ctx.request.body;
    const userId = ctx.request.user.id;

    if (!question) {
      ctx.helper.fail(ctx, '请输入查询内容!');
      return;
    }

    // 聊天记录存入数据库
    await ctx.model.Robot.create({
      sender_id: userId,
      accept_id: 0,
      content: question
    });

    const { url, key } = ctx.app.config.robot;

    // 接入接口
    const requestBody = {
      key,
      question,
      userid: 'cdad3913-7f36-41ad-b222-8fbd667109d7',
      num: 1
    };
    let result = {};
    try {
      result = await ctx.curl(url, {
        method: 'POST',
        data: requestBody,
        dataType: 'json'
      });
    } catch (error) {
      ctx.helper.fail(
        ctx,
        error.message || '网络请求超时,请重新发送',
        error.code || 400
      );
      return;
    }

    const { code, datatype, newslist: res } = result.data;
    const reply = res && res[0] ? res[0] : {};

    const data = {
      reply: reply.reply || reply.description
    };
    if (datatype === 'view') {
      data.img_url = reply.picUrl;
    }

    // 存入数据数据库
    await ctx.model.Robot.create({
      sender_id: 0,
      accept_id: userId,
      content: data.reply || '',
      img_url: data.img_url || ''
    });

    ctx.helper.success(ctx, data, code);
  }

  /**
   * @description 获取聊天记录
   */
  async getChatRecord() {
    const { ctx } = this;
    const { start_time, end_time } = ctx.query;
    const page = Number(ctx.query.page) || 1;
    const limit = Number(ctx.query.limit) || 15;
    const userId = ctx.request.user.id;

    const query = {
      [Op.or]: [{ sender_id: userId }, { accept_id: userId }]
    };
    // 查询指定时间范围内的数据
    if (start_time && end_time) {
      query.createdAt = {
        [Op.between]: [start_time, end_time]
      };
    }

    const result = await ctx.model.Robot.findAndCountAll({
      where: query,
      order: [['createdAt', 'DESC']],
      limit,
      offset: limit * (page - 1),
      attributes: [
        'id',
        'sender_id',
        'accept_id',
        'content',
        'img_url',
        'createdAt'
      ]
    });

    ctx.helper.success(ctx, result);
  }
}

module.exports = RobotController;
