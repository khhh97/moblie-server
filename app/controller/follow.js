const { Controller } = require('egg');
const { Op } = require('sequelize');

class FollowController extends Controller {
  /**
   * @description 新增关注或者取消关注
   */
  async create() {
    const { ctx } = this;
    let { id } = ctx.request.body;
    id = Number(id);
    const userId = ctx.request.user.id;

    if (!id) {
      ctx.helper.fail(ctx, '缺少必要参数!');
      return;
    }

    // 不能关注自己
    if (userId === id) {
      ctx.helper.fail(ctx, '不能关注自己!');
      return;
    }

    // 查询是否有关注记录,没有记录创建一条默认记录
    const where = { user_id: userId, followed_user_id: id };
    const record = (
      await ctx.model.Follow.findOrCreate({
        where,
        defaults: { ...where, status: '1' }
      })
    )[0];
    let status = record && record.status ? Number(record.status) : '';

    // 查询是否有被关注
    const followed = await ctx.model.Follow.findOne({
      where: {
        user_id: id,
        followed_user_id: userId
      }
    });

    // 处于未关注状态
    if (status === 1) {
      console.log(followed.status);
      status = followed && Number(followed.status) !== 1 ? 2 : 0;
      await ctx.model.Follow.update({ status: String(status) }, { where });
      if (followed && Number(followed.status) === 0) {
        // 被关注者状态设置为 互相关注 - 2
        await ctx.model.Follow.update(
          { status: '2' },
          { where: { user_id: id, followed_user_id: userId } }
        );
      }
      ctx.helper.success(ctx, { status }, '关注成功!');
      return;
    }

    // 关注中
    if (status === 0 || status === 2) {
      await ctx.model.Follow.update({ status: '1' }, { where });
      if (followed && Number(followed.status) === 2) {
        await ctx.model.Follow.update(
          { status: '0' },
          { where: { user_id: id, followed_user_id: userId } }
        );
      }
      ctx.helper.success(ctx, { status: 1 }, '已取消关注!');
    }
  }

  /**
   * @description 获取关注列表
   */
  async getFollowList() {
    const { ctx } = this;
    const { id, page = 1, limit = 15 } = ctx.query;

    // 查询自己的关注列表
    ctx.model.Follow.belongsTo(ctx.model.User, {
      foreignKey: 'followed_user_id',
      targetKey: 'id'
    });
    const result = await ctx.model.Follow.findAndCountAll({
      where: {
        user_id: id,
        [Op.or]: [{ status: '0' }, { status: '2' }]
      },
      limit: Number(limit),
      offset: Number(limit) * (Number(page) - 1),
      attributes: { exclude: ['user_id', 'followed_user_id'] },
      include: [
        {
          model: ctx.model.User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar']
        }
      ]
    });
    // result.setDataValue('page', Number(page));
    // result.setDataValue('pageSize', Number(limit));
    result.page = Number(page);
    result.pageSize = Number(limit);
    ctx.body = {
      code: 200,
      msg: '',
      data: result
    };
  }

  /**
   * @description 获取粉丝列表
   */
  async getFansList() {
    const { ctx } = this;
    const { id, page = 1, limit = 15 } = ctx.query;

    // 查询自己的粉丝列表
    ctx.model.Follow.belongsTo(ctx.model.User, {
      foreignKey: 'user_id',
      targetKey: 'id'
    });
    const result = await ctx.model.Follow.findAndCountAll({
      where: {
        followed_user_id: id,
        [Op.or]: [{ status: '0' }, { status: '2' }]
      },
      limit: Number(limit),
      offset: Number(limit) * (Number(page) - 1),
      attributes: { exclude: ['user_id', 'followed_user_id'] },
      include: [
        {
          model: ctx.model.User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar']
        }
      ]
    });
    result.page = Number(page);
    result.pageSize = Number(limit);
    // result.setDataValue('page', Number(page));
    // result.setDataValue('pageSize', Number(limit));
    ctx.body = {
      code: 200,
      msg: '',
      data: result
    };
  }
}

module.exports = FollowController;
