/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app'
import i18n from '../src/javascripts/lib/i18n'
import { CLIENT, ORGANIZATIONS } from './mocks/mock'
import { unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { configure } from '@testing-library/react'
import { screen } from '@testing-library/dom'

const mockEN = {
  'app.name': 'Rootly',
  'app.title': 'Rootly',
}

describe('Rootly', () => {
  beforeAll(() => {
    i18n.loadTranslations('en')

    jest.mock('../src/translations/en', () => {
      return mockEN
    })
  })

  describe('Rendering', () => {
    let appContainer = null

    beforeEach(() => {
      appContainer = document.createElement('section')
      appContainer.classList.add('main')
      document.body.appendChild(appContainer)
    })

    afterEach(() => {
      unmountComponentAtNode(appContainer)
      appContainer.remove()
      appContainer = null
    })

    it('render with current api key successfully', (done) => {
      act(() => {
        CLIENT.invoke = jest.fn().mockReturnValue(Promise.resolve({}))
        CLIENT.metadata = jest.fn().mockReturnValue(Promise.resolve({settings: {apiKey: "mock-api-key"}}))

        const app = new App(CLIENT, {})
        app.initializePromise.then(() => {
          const descriptionElement = screen.getByTestId('app-intro')
          expect(descriptionElement.textContent).toBe('Your Rootly API key is mock-api-key')
          done()
        })
      })
    })
  })
})
