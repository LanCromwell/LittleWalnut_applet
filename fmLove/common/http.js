const util = require('util.js')
const core = require('core.js')
const config = require('config.js')

/**
 * http-1.0
 * @param {请求参数} map
 * @description 参数map所有字段如下：
 * map.url          | string    | 接口地址
 * map.data         | object    | 请求参数（string/object/ArrayBuffer）
 * map.header       | object    | 设置请求的header，header中不能设置Referer。content-type 默认为 application/json
 * map.method       | string    | http请求方法
 * map.success      | function  | 接口调用成功的回调函数
 * map.fail         | function  | 接口调用失败的回调函数
 * map.complete     | function  | 接口调用结束的回调函数（调用成功、失败都会执行）
 * map.isForm       | boolean   | 是否表单提交 application/x-www-form-urlencoded
 */
const request = (url, map={}) => {
  map['url'] = url

  if(!map.data) {
    map['data'] = {}
  }

  var sessionKey = core.getSessionKey();
  var userId = core.getUserId();
  console.log("sessionKey",sessionKey)
  if(!util.isEmpty(sessionKey)){
    map['data']['token'] = sessionKey,
    map['data']['user_id'] = userId
    // map['data']['user_id'] = 44
  }

  if (!map.header) {
    map['header'] = {
      'content-type': map.isForm ? 'application/x-www-form-urlencoded' : 'application/json',
      'bm-platform':'miniprogram','link_id':config.link_id
    }
  }

  if(!map.method) {
    map['method'] = 'POST'
  }

  return wx.request({
      url: map.url,
      data: map.data,
      header: map.header,
      timeout: '30000',
      method: map.method.toUpperCase(),
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        util.log(map.url, map.method, map.data, map.header, res.data)
        if (map.success) {
          map.success(res)
        }
      },
      fail: (res) => {
        util.log(map.url, map.method, map.data, map.header, res.data)
        if (map.fail) {
          map.fail(res)
        }
      },
      complete: (res) => {
        if (map.complete) {
          map.complete(res)
        }
      }
    })
}

/**
 * http-2.0
 * 支持Promise风格
 */
const request2 = (url, map={}) => {
  return new Promise((resolve, reject) => {
    map['success'] = (res) => {
      resolve(res)
    }
    map['fail'] = (res) => {
      reject(res)
    }
    request(url, map)
  })
}

module.exports = {
  request: request,
  request2: request2
}