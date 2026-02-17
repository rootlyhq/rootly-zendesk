import qs from 'qs'

const version = require('../../../package.json').version

const zafClient = null

class RootlyApi {
  initialize (zafClient) {
    this.zafClient = zafClient
    return this.zafClient.metadata().then(({ settings: { apiUrl, apiKey } }) => {
      this.apiUrl = apiUrl
      this.apiKey = apiKey
      this.secure = apiUrl === 'https://api.rootly.com/v1' || !apiKey
    })
  }

  get (url, params) {
    return this.request('GET', url, params)
  }

  post (url, body) {
    return this.request('POST', url, body)
  }

  patch (url, body) {
    return this.request('PATCH', url, body)
  }

  request (method, url, params) {
    if (this.secure) {
      return this.requestZafProxy(method, url, params)
    } else {
      return this.requestFetch(method, url, params)
    }
  }

  requestFetch (method, url, params) {
    return fetch(`${this.apiUrl}${url}${method === 'GET' && params ? `?${qs.stringify(params)}` : ''}`, {
      method,
      cors: false,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'X-User-Agent': `Rootly Zendesk App ${version}`,
        Accepts: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      },
      body: params && method !== 'GET' ? JSON.stringify(params) : null
    })
      .then((res) => res.json())
      .then(handleRespError)
  }

  // use ZAF proxy to avoid exposing API key in production, doesn't work in local development environment
  requestZafProxy (method, url, params) {
    return this.zafClient.request({
      url: `${this.apiUrl}${url}${method === 'GET' && params ? `?${qs.stringify(params)}` : ''}`,
      type: method,
      cors: false,
      secure: true,
      headers: {
        Authorization: 'Bearer {{setting.apiKey}}',
        'X-User-Agent': `Rootly Zendesk App ${version}`, // ZAF proxy doesn't allow setting User-Agent
        Accepts: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      },
      dataType: 'json',
      data: params && method !== 'GET' ? JSON.stringify(params) : null
    })
      .then(handleRespError)
  }
}

function handleRespError (res) {
  if (res.errors) {
    const error = new Error(res.errors[0].title)
    error.api = true
    return Promise.reject(error)
  }
  return res
}

export default new RootlyApi()
