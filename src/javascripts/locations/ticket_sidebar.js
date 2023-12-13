// need to import basic garden css styles
import '@zendeskgarden/css-bedrock'

import { start as startApp } from '../modules/app'

/* global ZAFClient */
const client = ZAFClient.init()

client.on('app.registered', function () {
  return startApp(client)
})
