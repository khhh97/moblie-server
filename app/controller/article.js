const { Controller } = require('egg');
const Sequelize = require('sequelize');

class ArticleController extends Controller {
  /**
   * 新增文章
   */
  async create() {
    const { ctx } = this;
    const article = ctx.request.body;
    ctx.validate(
      {
        title: {
          type: 'string',
          required: true
        },
        content: {
          type: 'string',
          required: true
        },
        img1_url: {
          type: 'url',
          required: false
        },
        img2_url: {
          type: 'url',
          required: false
        },
        img3_url: {
          type: 'url',
          required: false
        },
        video_url: {
          type: 'url',
          required: false
        },
        topic_id: {
          type: 'string',
          required: true
        }
      },
      article
    );
    const userId = ctx.request.user.id;
    const result = await ctx.model.Article.create({
      title: article.title,
      content: article.content,
      img1_url: article.img1_url || '',
      img2_url: article.img2_url || '',
      img3_url: article.img3_url || '',
      video_url: article.video_url || '',
      post_id: userId,
      topic_id: article.topic_id
    });
    ctx.helper.success(ctx, result, '文章创建成功!');
  }

  /**
   * @description 获取文章详情
   */
  async getArticleDetail() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (!id || typeof Number(id) !== 'number') {
      ctx.helper.fail(ctx, '缺少必要参数');
      return;
    }
    ctx.model.Article.belongsTo(ctx.model.User, {
      foreignKey: 'post_id',
      targetKey: 'id'
    });
    const article = await ctx.model.Article.findOne({
      where: { id },
      include: [
        {
          model: ctx.model.User,
          attributes: ['id', 'avatar', 'nickname']
        }
      ]
    });
    if (!article) {
      ctx.helper.fail(ctx, '文章不存在!', 404);
      return;
    }
    // 文章浏览记录加一
    const lookCount = article.browse_count;
    await ctx.model.Article.update(
      {
        browse_count: lookCount + 1
      },
      {
        where: { id }
      }
    );
    delete article.dataValues.browse_count;
    const post_id = article.post_id;
    delete article.dataValues.post_id;
    // 登录情况下，新增一条浏览记录
    if (ctx.request.user) {
      const userId = ctx.request.user.id;
      const record = await ctx.model.History.findOrCreate({
        where: { article_id: id, user_id: userId },
        defaults: { article_id: id, user_id: userId }
      });
      const isNew = record[1];
      if (!isNew) {
        await ctx.model.History.update(
          {
            times: record[0].times + 1
          },
          {
            where: { article_id: id, user_id: userId }
          }
        );
      }
    }
    // 查询作者其他的推荐文章
    const recommend = await ctx.model.Article.findAll({
      where: {
        post_id,
        id: {
          [Sequelize.Op.not]: id
        }
      },
      attributes: ['id', 'title', 'browse_count'],
      order: [['browse_count', 'DESC']],
      limit: 6
    });
    article.dataValues.recommend = recommend ? recommend : [];
    ctx.helper.success(ctx, article);
  }
}

module.exports = ArticleController;
