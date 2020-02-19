/**
 * @description 校验手机号码
 * @param {Context} ctx - Koa Context
 * @param {String} phone - 手机号码
 */
exports.validatePhone = (ctx, phone) => {
  const result = {
    code: 422,
    msg: '',
    data: ''
  };

  if (!phone) {
    result.msg = '请填写手机号码!';
    return result;
  }

  if (!/(?:^1[3456789]|^9[28])\d{9}$/.test(phone)) {
    result.msg = '请填写正确的手机号码!';
    return result;
  }

  return {};
};

/**
 * @description 随机生成6位数字验证码
 * @param {String} verify - 验证码
 * @return {Number} verify - 验证码
 */
const generateVerify = (verify = '') => {
  // 生成6位 0-9 随机数
  verify += Math.floor(Math.random() * 10);
  if (verify.length !== 6) {
    verify = generateVerify(verify);
  }
  return Number(verify);
};
exports.generateVerify = generateVerify;
