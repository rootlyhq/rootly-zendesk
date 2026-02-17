export const CLIENT = {
  _origin: 'zendesk.com',
  get: (prop) => {
    if (prop === 'currentUser') {
      return Promise.resolve({
        currentUser: {
          locale: 'en',
          name: 'Sample User'
        }
      })
    }
    if (prop === 'ticket') {
      return Promise.resolve({
        ticket: {
          id: 10
        }
      })
    }
    return Promise.resolve({
      [prop]: null
    })
  },
  invoke: () => Promise.resolve({}),
  context: () => {
    return Promise.resolve({
      account: {
        subdomain: 'test'
      }
    })
  },
  metadata: () => {
    return Promise.resolve({
      settings: {
        apiKey: 'mock-api-key',
        apiUrl: 'http://api.test.com'
      }
    })
  },
  request: () => {
    return Promise.resolve({ data: [] })
  }
}
