import React from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { createStore } from '../../javascripts/redux/store'
import { loadIncidents } from '../../javascripts/redux/slices/incidents'
import Incidents from '../../javascripts/components/incidents'

export default function App({ settings, ticket, zafClient }) {
  const store = createStore({ settings, ticket })

  store.subscribe(() => {
    setTimeout(() => {
      const height = document.body.querySelector(".main").clientHeight + 48
      zafClient.invoke('resize', { height })
    }, 100)
  })

  store.dispatch(loadIncidents())

  return (
    <ThemeProvider theme={{ ...DEFAULT_THEME }}>
      <Provider store={store}>
        <Incidents />
      </Provider>
    </ThemeProvider>
  )
}
