import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  apiUrl: 'https://api.rootly.com/v1',
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    loadSettings: (state, action) => action.payload
  }
})

export const { loadSettings } = settingsSlice.actions

export default settingsSlice.reducer
