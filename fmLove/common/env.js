const currEnv = 'pro'

const env = {
  dev: {
    main: 'https://test.api.mamaucan.cn'
  },
  pro: {
    main: 'https://api.mamaucan.cn'
  }
}

const getUrl = (uri, host) => {
  return env[currEnv][host?host:'main']+uri
}

module.exports = {
  getUrl: getUrl
}