import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    clearError: (state) => {
      return null
    },
    setError: (state, action) => {
      return action.payload
    }
  }
})

export const { clearError, setError } = errorSlice.actions

export default errorSlice.reducer
