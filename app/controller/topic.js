const { Controller } = require('egg');
const uuidv4 = require('uuid/v4');

class TopicController extends Controller {
  /**
   * @description 获取所有主题
   */
  async getAllTopic() {
    const { ctx } = this;
    const result = await ctx.model.Topic.findAll({
      where: {
        show: true
      },
      attributes: [['key', 'id'], 'name']
    });
    ctx.helper.success(ctx, result);
  }

  /**
   * @description 新增主题
   */
  async new() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    ctx.validate(
      {
        name: {
          type: 'string',
          required: true
        }
      },
      ctx.request.body
    );
    const topic = await ctx.model.Topic.findOne({
      where: { name }
    });
    if (topic) {
      ctx.helper.fail(ctx, '该主题已存在!');
      return;
    }
    const result = await ctx.model.Topic.create({
      name,
      key: uuidv4(),
      show: true
    });
    ctx.helper.success(ctx, { id: result.key, name: result.name }, '创建成功!');
  }
}

module.exports = TopicController;
