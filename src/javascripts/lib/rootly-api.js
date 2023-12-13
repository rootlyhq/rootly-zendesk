const version = require('../../../package.json').version

class RootlyApi {
  /**
   * @param {String} apiUrl
   * @param {String} apiKey
   */
  constructor({ apiUrl, apiKey }) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
  }

  get(url) {
    return this.request("GET", url)
  }

  post(url, body) {
    return this.request("POST", url, body)
  }

  patch(url, body) {
    return this.request("PATCH", url, body)
  }

  request(method, url, body) {
    return fetch(`${this.apiUrl}${url}`, {
      method: method,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "User-Agent": `Rootly Zendesk App ${version}`,
        "Accepts": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json"
      },
      body: typeof body === "object" ? JSON.stringify(body) : body
    })
    .then((res) => res.json())
  }
}

export default function(settings) {
  return new RootlyApi(settings)
}
