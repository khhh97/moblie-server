'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 统一路由前缀 /api
  const subRouter = router.namespace('/api');
  // 发送验证码
  subRouter.post('/verify', controller.user.sendVerifyCode);

  // 登录
  subRouter.post('/login', controller.user.login);

  // 上传文件
  subRouter.post('/upload', controller.common.uploadFile);

  // 获取自己的用户信息
  subRouter.get('/user/my', controller.user.getMyInfo);

  // 获取自己的浏览历史
  subRouter.get('/user/my/history', controller.article.getMyBrowseHistory);

  // 获取自己点赞的文章
  subRouter.get('/user/my/likes', controller.praise.getMyPraiseArticle);

  // 获取我收藏的文章
  subRouter.get('/user/my/collect', controller.collect.getMyCollections);

  // 获取个人主页信息
  subRouter.get('/user/profile', controller.user.getUserInfo);

  // 更新用户信息
  subRouter.post('/user/update', controller.user.updateUserInfo);

  // 上传用户头像
  subRouter.post('/user/avatar', controller.user.updateUserAvatar);

  // 新增关注
  subRouter.post('/follow', controller.follow.create);

  // 获取关注列表
  subRouter.get('/follows', controller.follow.getFollowList);

  // 获取粉丝列表
  subRouter.get('/fans', controller.follow.getFansList);

  // 创建主题
  subRouter.post('/topic', controller.topic.new);

  // 获取所有可展示主题
  subRouter.get('/topics', controller.topic.getAllTopic);

  // 创建文章
  subRouter.post('/article', controller.article.create);

  // 获取文章信息
  subRouter.get('/article', controller.article.getArticleDetail);

  // 获取文章列表
  subRouter.get('/article/list', controller.article.getArticleList);

  // 搜索接口建议
  subRouter.get('/suggest', controller.article.getSearchSuggest);

  // 对评论或者文章点赞
  subRouter.post('/like', controller.praise.giveLike);

  subRouter.post('/collect', controller.collect.collectArticle);

  // 创建评论
  subRouter.post('/comment', controller.comment.create);

  // 获取评论列表
  subRouter.get('/comment', controller.comment.getArticleComments);

  // 在线机器人聊天
  subRouter.post('/robot', controller.robot.sendMsg);

  // 获取与机器人的聊天记录
  subRouter.get('/robot/records', controller.robot.getChatRecord);
};
