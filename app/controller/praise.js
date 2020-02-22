const { Controller } = require('egg');

class PraiseController extends Controller {
  /**
   * @description 点赞
   */
  async giveLike() {
    const { ctx } = this;
    const { id, like_type: type = '0' } = ctx.request.body;
    const userId = ctx.request.user.id;
    if (!id) {
      ctx.helper.fail(ctx, '缺少必要参数id');
      return;
    }
    const record = await ctx.model.Praise.findOrCreate({
      where: { praised_id: id, user_id: userId, type },
      defaults: { praised_id: id, user_id: userId, type }
    });
    const isNew = record[1];
    // 能查出结果时，删除此条记录
    if (isNew) {
      ctx.helper.success(ctx, { status: 0 }, '点赞成功');
    } else {
      // 删除点赞记录，代表取消点赞
      const result = await ctx.model.Praise.destroy({
        where: { praised_id: id, user_id: userId, type }
      });
      let msg = '已取消点赞!';
      let status = 1;
      if (result === 0) {
        status = 0;
        msg = '取消失败,请重新尝试!';
      }
      ctx.helper.success(ctx, { status }, msg);
    }
  }

  /**
   * 获取我点赞的文章
   */
  async getMyPraiseArticle() {
    const { ctx } = this;
    const page = Number(ctx.query.page) || 1;
    const limit = Number(ctx.query.limit) || 15;
    const userId = ctx.request.user.id;
    const likes = await ctx.model.Praise.findAndCountAll({
      where: { user_id: userId, type: '0' },
      limit,
      offset: limit * (page - 1),
      order: [['created_at', 'DESC']]
    });
    const ids = likes.rows.map(item => item.praised_id);
    const result = await ctx.service.article.findAll(ctx, {
      page,
      limit,
      ids
    });
    result.count = likes.count;
    ctx.helper.success(ctx, result);
  }
}

module.exports = PraiseController;
