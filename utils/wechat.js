// utils/wechat.js
const axios = require('axios');

// 缓存 access_token，避免频繁获取
let cachedToken = {
  token: null,
  expireTime: 0,
};

/**
 * 获取小程序的 access_token
 */
async function getAccessToken() {
  const now = Date.now();
  if (cachedToken.token && cachedToken.expireTime > now) {
    return cachedToken.token;
  }

  const { WX_APPID, WX_SECRET } = process.env;
  const res = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
    params: {
      grant_type: 'client_credential',
      appid: WX_APPID,
      secret: WX_SECRET,
    },
  });

  if (res.data.errcode) {
    throw new Error(`获取access_token失败: ${res.data.errmsg}`);
  }

  cachedToken = {
    token: res.data.access_token,
    expireTime: now + (res.data.expires_in - 300) * 1000, // 提前5分钟刷新
  };
  return cachedToken.token;
}

/**
 * 通过 code 换取手机号（新版本方式）
 * @param {string} code - wx.getPhoneNumber 返回的动态令牌
 * @returns {string} 手机号
 */
async function getPhoneNumberByCode(code) {
  const accessToken = await getAccessToken();
  const res = await axios.post(
    `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`,
    { code }
  );
  if (res.data.errcode !== 0) {
    throw new Error(`获取手机号失败: ${res.data.errmsg}`);
  }
  return res.data.phone_info.purePhoneNumber; // 无区号的手机号
}

module.exports = {
  getPhoneNumberByCode,
};