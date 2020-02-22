const { Service } = require('egg');

class UserService extends Service {
  // eslint-disable-next-line jsdoc/require-param
  /**
   * @description 获取用户的关注数量、粉丝数量、文章数量数量
   */
  async getUserAllCount(ctx, userId) {
    // 关注数
    const stars = await ctx.model.Follow.count({
      where: { user_id: userId }
    });
    // 粉丝数
    const followers = await ctx.model.Follow.count({
      where: { followed_user_id: userId }
    });
    // 文章数量
    const articles = await ctx.model.Article.count({
      where: { post_id: userId }
    });
    return {
      fans_count: followers || 0,
      follow_count: stars || 0,
      article_count: articles || 0
    };
  }
}

module.exports = UserService;
