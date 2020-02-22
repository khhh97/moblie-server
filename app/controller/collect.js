const { Controller } = require('egg');

class CollectController extends Controller {
  /**
   * @description 对文章收藏
   */
  async collectArticle() {
    const { ctx } = this;
    const { article_id } = ctx.request.body;
    const userId = ctx.request.user.id;
    if (!article_id) {
      ctx.helper.fail(ctx, '缺少必要参数article_id');
      return;
    }
    const record = await ctx.model.Collection.findOrCreate({
      where: { article_id, user_id: userId },
      defaults: { article_id, user_id: userId }
    });
    const isNew = record[1];
    if (isNew) {
      ctx.helper.success(ctx, { status: 0 }, '收藏成功');
    } else {
      await ctx.model.Collection.destroy({
        where: { article_id, user_id: userId }
      });
      ctx.helper.success(ctx, { status: 1 }, '已取消收藏');
    }
  }

  /**
   * @description 获取我收藏的文章列表
   */
  async getMyCollections() {
    const { ctx } = this;
    const page = Number(ctx.query.page) || 1;
    const limit = Number(ctx.query.limit) || 15;
    const userId = ctx.request.user.id;
    const collections = await ctx.model.Collection.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset: limit * (page - 1),
      order: [['created_at', 'DESC']]
    });
    const ids = collections.rows.map(item => item.article_id);
    const result = await ctx.service.article.findAll(ctx, {
      page,
      limit,
      ids
    });
    result.count = collections.count;
    ctx.helper.success(ctx, result);
  }
}

module.exports = CollectController;
