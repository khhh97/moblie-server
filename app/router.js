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

  // 获取个人主页信息
  subRouter.get('/user/profile/:id', controller.user.getUserInfo);

  // 更新用户信息
  subRouter.post('/user/update', controller.user.updateUserInfo);

  // 上传用户头像
  subRouter.post('/user/avatar', controller.user.updateUserAvatar);
};
