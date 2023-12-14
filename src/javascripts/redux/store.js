import { configureStore } from '@reduxjs/toolkit'
import errorReducer from './slices/error'
import incidentsReducer from './slices/incidents'
import settingsReducer from './slices/settings'
import ticketReducer from './slices/ticket'

export const createStore = (preloadedState) => configureStore({
  reducer: {
    error: errorReducer,
    incidents: incidentsReducer,
    ticket: ticketReducer,
    settings: settingsReducer,
  },
  preloadedState
})
