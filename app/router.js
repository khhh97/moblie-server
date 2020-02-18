'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 统一路由前缀 /api
  const subRouter = router.namespace('/api');
  subRouter.get('/', controller.home.index);
};
