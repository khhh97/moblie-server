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

};
