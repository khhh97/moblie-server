const { Service } = require('egg');
const qiniu = require('qiniu');
const path = require('path');
const fs = require('mz/fs');
const QcloudSms = require('qcloudsms_js');

// 公用的一些服务
class CommonService extends Service {
  // 上传文件服务
  async uploadFile(ctx) {
    const files = ctx.request.files;

    // 处理没有上传的文件
    if (files.length === 0) {
      return {
        code: 400,
        msg: '请选择上传文件',
        data: ''
      };
    }
    if (files.length === 1) {
      return await this.uploadSingleFile(ctx);
    }
    const result = [];
    // 多文件上传
    for (const file of files) {
      const res = await this.uploadSingleFile(ctx, file);
      result.push({
        url: res.data,
        name: file.fieldname,
        filename: file.filename
      });
    }
    return {
      code: 200,
      msg: '',
      data: result
    };
  }

  // 单文件上传
  async uploadSingleFile(ctx, singleFile) {
    let file = {};
    if (!singleFile) {
      const files = ctx.request.files;
      // 处理没有上传的文件
      if (files.length === 0) {
        return {
          code: 400,
          msg: '请选择上传文件',
          data: ''
        };
      }
      file = files[0];
    } else {
      file = singleFile;
    }
    const { filepath } = file;

    const name = 'mobile/' + path.basename(filepath);
    let result;
    try {
      // 处理文件，上传到云端
      result = await ctx.oss.put(name, filepath);
    } finally {
      // 删除临时文件
      await fs.unlink(filepath);
    }

    return {
      code: 200,
      msg: '',
      data: result && result.url
    };
  }

  /**
   * @description 发送验证码-七牛云
   * @param {Context} ctx - Koa Context
   * @param {String|Number} verify -验证码
   * @param {String} phone - 手机号码
   * @param {Object} options - 发送验证码配置信息，可覆盖已有配置信息
   */
  async sendQiNiuMsg(ctx, verify, phone, options) {
    const sendMessagePromise = new Promise((resolve, reject) => {
      const { accessKey, secretKey, template_id } = ctx.app.config.qiniu;
      // 获取认证密匙
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      // 请求内容
      const reqBody = {
        template_id,
        mobile: phone,
        parameters: {
          code: String(verify)
        },
        ...options
      };
      // 发送短信
      qiniu.sms.message.sendSingleMessage(
        reqBody,
        mac,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
          } else {
            resolve(respInfo);
          }
        }
      );
    });

    const result = await sendMessagePromise;
    if (result.status && result.status === 200) {
      return {
        code: 200,
        msg: '发送成功',
        data: ''
      };
    }
    return {
      code: result.status || 400,
      msg: result.statusMessage || '发送失败,请重试',
      data: ''
    };
  }

  /**
   * @description 发送验证码-腾讯云
   * @param {Context} ctx - Koa Context
   * @param {String|Number} verify -验证码
   * @param {String} phone - 手机号码
   */
  async sendTencentVerify(ctx, verify, phone) {
    const { appid, appkey, templateId, smsSign } = ctx.app.config.qCloudSms;

    const sendMsgPromise = new Promise((resolve, reject) => {
      // 实例化QcloudSms
      const qcloudsms = QcloudSms(appid, appkey);
      const ssender = qcloudsms.SmsSingleSender();
      ssender.sendWithParam(
        86,
        [phone],
        templateId,
        [verify, 15],
        smsSign,
        '',
        '',
        (err, res, resData) => {
          if (err) {
            reject(err);
          } else {
            resolve(resData);
          }
        }
      ); // 签名参数不能为空串
    });

    const result = await sendMsgPromise;
    if (result.result === 0) {
      return {
        code: 200,
        msg: '发送成功',
        data: ''
      };
    }
    return {
      code: result.result || 400,
      msg: result.errmsg || '发送失败,请重试',
      data: ''
    };
  }
}

module.exports = CommonService;
