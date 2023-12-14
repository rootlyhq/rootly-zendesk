/* eslint-env jest, browser */
import { createRoot } from 'react-dom/client'
import { start as startApp } from '../src/javascripts/modules/app'
import { CLIENT } from './mocks/mock'

describe('App', () => {
  let appContainer = null
  let root = null

  beforeAll(() => {
    window.fetch = () => Promise.resolve({json: () => Promise.resolve({ data: [], meta: {total_pages: 0} })})
    appContainer = document.createElement('section')
    appContainer.classList.add('main')
    document.body.appendChild(appContainer)
  })

  beforeEach(() => {
    root = createRoot(appContainer)
  })

  afterEach(() => {
    root.unmount()
  })

  it('renders successfully', async () => {
    return startApp(CLIENT, root).then(() => {
      // assertions go here
    })
  })
})
