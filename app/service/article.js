const { Service } = require('egg');
const { Op, fn, col } = require('sequelize');

class ArticleService extends Service {
  /**
   * @description 查询所有的符合查询条件的文章
   * @param {Object} ctx - Koa Context
   * @param {Object} query - 查询条件
   * @param {Number|String} query.page - 页码
   * @param {Number|String} query.limit - 每页的限制数量
   * @param {keyword} query.keyword - 搜索关键词
   * @param {Number} query.post_id - 文章发布者id
   * @param {String} query.topic_id - 文章所属主题的key值
   * @param {Array} query.ids - 根据id查询
   */
  async findAll(ctx, query) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 15;
    const keyword = query.keyword || '';
    let order = [['created_at', 'DESC']];
    delete query.page;
    delete query.limit;
    if (query.keyword) {
      // 文章内容和标题检索
      query[Op.or] = [
        {
          content: {
            [Op.substring]: keyword
          }
        },
        {
          title: {
            [Op.substring]: keyword
          }
        }
      ];
    }
    delete query.keyword;
    // 根据id查询
    if (query.ids && query.ids instanceof Array) {
      query.id = {
        [Op.in]: query.ids
      };
      if (query.ids.length > 0) {
        order = [[fn('field', col('article.id'), query.ids)]];
      }
    }
    delete query.ids;
    ctx.model.Article.belongsTo(ctx.model.User, {
      foreignKey: 'post_id',
      targetKey: 'id'
    });
    ctx.model.Article.hasMany(ctx.model.Comment, {
      foreignKey: 'id',
      targetKey: 'compose_id'
    });
    return await ctx.model.Article.findAndCountAll({
      where: query,
      limit,
      offset: limit * (page - 1),
      attributes: [
        'id',
        'title',
        'content',
        'createdAt',
        'img1_url',
        'img2_url',
        'img3_url'
      ],
      order,
      include: [
        {
          model: ctx.model.User,
          attributes: ['id', 'avatar', 'nickname']
        }
      ]
    }).then(async res => {
      const { count, rows } = res;
      const queryResult = {
        count,
        page,
        pageSize: limit,
        keyword: query.keyword || ''
      };
      queryResult.rows = await Promise.all(
        rows.map(async article => {
          const comments = await ctx.model.Comment.count({
            where: { compose_id: article.id }
          });
          article.dataValues.comments = comments;
          // 整合img数量
          const imgs = [article.img1_url, article.img2_url, article.img3_url];
          article.dataValues.imgs = imgs.filter(item => item);
          delete article.dataValues.img1_url;
          delete article.dataValues.img2_url;
          delete article.dataValues.img3_url;
          return article;
        })
      );
      return queryResult;
    });
  }
}

module.exports = ArticleService;
