const env = require('env.js')
module.exports = {
  /**登录 */
  login: env.getUrl('/api/wechat_mini_program/login'),
  /**上传微信信息到服务器 */
  setWxInfo:env.getUrl('/api/wechat_mini_program/store_user_info'),
  /**设置用户信息 */
  setting:env.getUrl('/api/user/edit'),
  /**获取角色*/
  getRoleList:env.getUrl('/api/role/list'),
  /**获取语言*/
  getLanguageList:env.getUrl('/api/language/list'),
  /**更新用户信息 */
  updateUserInfo:env.getUrl('/api/user/edit'),
  /**获取用户信息 */
  getUserInfo:env.getUrl('/api/user/user_info'),
  /**获取分享海报 */
  getHaibaoInfo:env.getUrl('/api/wechat_mini_program/get_poster_template'),
  /**今日提醒接口 */
  getTodayRemindInfo:env.getUrl('/api/wechat_mini_program/get_home_list'),
  /**收藏 */
  priseData:env.getUrl('/api/audio/user_collect_audio'),
  /**是否收藏了 */
  isPriseData:env.getUrl('/api/audio/user_is_collect_audio'),
    /**是否达标 */
  isdabiaoData:env.getUrl('/api/audio/user_is_accomplish'),
  /**达标 */
  dabiaoData:env.getUrl('/api/audio/operate_user_audio_accomplish_log'),

}