// 调用腾讯云短信api
//短信发送工具类
const QcloudSms = require("qcloudsms_js");
module.exports = function (phoneNumber) {
  // 实例化一个认证对象，入参需要传入腾讯云账户密钥对 secretId 和 secretKey
  let qcloudsms = QcloudSms('1400506701', 'f8e2d8414c27d65d6beb16657131a242')
  let smsType = 0
  let ssender = qcloudsms.SmsSingleSender();
  return new Promise(function (resolve, reject) {
    let templateId = '918739' //短信模板id
    let smssign = '摸鱼的学问'  //短信签名
    let code = String(Math.random()).slice(-4)  //验证码
    let time = 10
    let params = [code, time]  //模板变量
    ssender.sendWithParam(86, phoneNumber, templateId, params, smssign, "", "", function (err, res, resData) {
      if (err) {
        reject();//发送失败
      } else {
        resolve(params);
      }
    });
  });
}