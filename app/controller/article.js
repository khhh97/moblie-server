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
    let userId = '';
    if (!id || typeof Number(id) !== 'number') {
      ctx.helper.fail(ctx, '缺少必要参数');
      return;
    }

    // 如果登录情况下，校验token获取userId
    const user = await ctx.helper.validateToken(ctx, ctx.request.header.token);
    if (user && user.user_id) userId = user.user_id;

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
    if (userId) {
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
    article.dataValues.like = false;
    article.dataValues.collect = false;

    // 获取登录情况下对该文章的点赞与收藏情况
    if (userId) {
      const hasPraise = await ctx.model.Praise.findOne({
        where: { type: '0', user_id: userId, praised_id: id }
      });
      if (hasPraise) article.dataValues.like = true;
      const hasCollect = await ctx.model.Collection.findOne({
        where: { user_id: userId, article_id: id }
      });
      if (hasCollect) article.dataValues.collect = true;
    }

    ctx.helper.success(ctx, article);
  }

  /**
   * @description 获取文章列表
   */
  async getArticleList() {
    const { ctx } = this;
    const { page = 1, limit = 15, topic_id, post_id, keyword } = ctx.query;
    const searchQuery = {};
    searchQuery.page = page;
    searchQuery.limit = limit;
    if (keyword) searchQuery.keyword = keyword;
    if (topic_id) searchQuery.topic_id = topic_id;
    if (post_id) searchQuery.post_id = post_id;
    const result = await ctx.service.article.findAll(ctx, searchQuery);
    ctx.helper.success(ctx, result);
  }

  /**
   * @description 获取我的观看历史
   */
  async getMyBrowseHistory() {
    const { ctx } = this;
    const page = Number(ctx.query.page) || 1;
    const limit = Number(ctx.query.limit) || 15;
    const userId = ctx.request.user.id;
    const history = await ctx.model.History.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset: limit * (page - 1),
      order: [
        ['times', 'DESC'],
        ['created_at', 'DESC']
      ]
    });
    const ids = history.rows.map(item => item.article_id);
    const result = await ctx.service.article.findAll(ctx, {
      page,
      limit,
      ids
    });
    result.count = history.count;
    ctx.helper.success(ctx, result);
  }
}

module.exports = ArticleController;
