import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    loadTicket: (state, action) => action.payload
  }
})

export const { loadTicket } = ticketSlice.actions

export default ticketSlice.reducer
