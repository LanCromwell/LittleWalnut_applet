const util = require('util.js')

/**
 * 获取sign签名
 */
const getSign = () => {
  let info = getLoginInfo()
  return info ? info.sign : ''
}

/**
 * 保存用户open_id
 * @param {*} value 
 */
const putOpenId = (value) => {
  util.putValue('login.openid', value)
}

/**
 * 获取openId
 */
const getOpenId = () => {
  return util.getValue('login.openid')
}

/**
 * 保存用户SessionKey
 * @param {*} value 
 */
const putSessionKey = (value) => {
  util.putValue('login.session_key', value)
}

/**
 * 获取SessionKey
 */
const getSessionKey = () => {
  return util.getValue('login.session_key')
}

/**
 * 存储用户Id
 * @param {*} value 
 */
const putUserId = (value) => {
  util.putValue('login.userId',value)
}
/**
 * 获取用户Id
 */
const getUserId = () =>{
  return util.getValue('login.userId')
}

/**
 * 保存用户信息
 * @param {*} userInfo 
 */
const putLoginInfo = (value) => {
  util.putValue('login.info', value)
}

/**
 * 获取登录信息
 */
const getLoginInfo = () => {
  return util.getValue('login.info')
}

/**
 * 清除登录信息
 */
const delLoginInfo = () => {
  util.delValue('login.info')
}

/**
 * 获取微信用户信息授权的加密信息，新用户首次登录没有unionid情况下调用
 * @param {*} value 
 */
const putEncryptedData = (value) => {
  util.putValue('login.wx.encrypted.data', value)
}
const getEncryptedData = () => {
  return util.getValue('login.wx.encrypted.data') 
}
const putIv = (value) => {
  util.putValue('login.wx.iv', value)
}
const getIv = () => {
  return util.getValue('login.wx.iv') 
}

/**
 * 获取微信授权code，账号绑定用到的code
 * @param {微信授权登录返回的code} value 
 */
const putCode = (value) => {
  util.putValue('login.wxcode', value)
}
const getCode = () => {
  return util.getValue('login.wxcode') 
}

/**
 * 解析Page.onload中的options.scene字段
 * @param {*} scene 
 */
const getScene = (scene) => {
  let o = {}
  if (util.isEmpty(scene)) {
    return o
  }
  let params = decodeURIComponent(scene).split("&")
  params.forEach(item => {
    let pram = item.split("=")
    o[pram[0]] = pram[1]
  })
  return o
}


module.exports = {
  getSign: getSign,
  putLoginInfo: putLoginInfo,
  getLoginInfo: getLoginInfo,
  delLoginInfo: delLoginInfo,
  getScene: getScene,
  putEncryptedData,
  getEncryptedData,
  putIv: putIv,
  getIv: getIv,
  putCode:putCode,
  getCode:getCode,
  putOpenId:putOpenId,
  getOpenId:getOpenId,
  putSessionKey:putSessionKey,
  getSessionKey:getSessionKey,
  putUserId:putUserId,
  getUserId:getUserId
}