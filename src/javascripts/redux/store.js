import { configureStore } from '@reduxjs/toolkit'
import incidentsReducer from './slices/incidents'
import settingsReducer from './slices/settings'
import ticketReducer from './slices/ticket'

export const createStore = (preloadedState) => configureStore({
  reducer: {
    incidents: incidentsReducer,
    ticket: ticketReducer,
    settings: settingsReducer,
  },
  preloadedState
})
