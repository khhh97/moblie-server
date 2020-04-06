const { Controller } = require('egg');

class CommentController extends Controller {
  /**
   * @description 新增评论
   */
  async create() {
    const { ctx } = this;
    const { article_id, content } = ctx.request.body;
    const { id } = ctx.request.user;

    ctx.validate(
      {
        article_id: {
          type: 'number',
          required: true
        },
        content: {
          type: 'string',
          required: true
        }
      },
      ctx.request.body
    );

    const comment = await ctx.model.Comment.create({
      compose_id: article_id,
      content,
      from_user_id: Number(id)
    });

    // 查询用户信息
    const user = await ctx.model.User.findOne({
      where: { id },
      attributes: ['id', 'nickname', 'avatar']
    });

    comment.dataValues.user = user;
    const result = {
      id: comment.id,
      article_id: comment.compose_id,
      content: comment.content,
      user,
      createdAt: comment.createdAt
    };
    ctx.helper.success(ctx, result, '评论创建成功!');
  }

  // 获取对应文章的评论
  async getArticleComments() {
    const { ctx } = this;
    let { article_id, limit = 15, page = 1 } = ctx.query;
    if (!article_id) {
      ctx.helper.fail(ctx, '缺少必要参数article_id');
      return;
    }
    limit = Number(limit);
    page = Number(page);

    ctx.model.Comment.belongsTo(ctx.model.User, {
      foreignKey: 'from_user_id',
      targetKey: 'id'
    });
    const comments = await ctx.model.Comment.findAndCountAll({
      where: { compose_id: article_id },
      limit,
      offset: limit * (page - 1),
      attributes: ['id', ['compose_id', 'article_id'], 'content', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: ctx.model.User,
          attributes: ['id', 'avatar', 'nickname']
        }
      ]
    });
    comments.page = page;
    comments.pageSize = limit;

    ctx.helper.success(ctx, comments);
  }
}

module.exports = CommentController;
