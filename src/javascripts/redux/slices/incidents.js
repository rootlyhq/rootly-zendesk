import { createSlice } from '@reduxjs/toolkit'
import rootlyApiClient from '../../lib/rootly-api'

const initialState = {
  loading: true,
  entities: {}, // incident attributes by Id
  foundIds: [], // incidents found by search
  currentPage: 1,
  totalPages: 0,
  searchQuery: ""
}

const incidentsSlice = createSlice({
  name: "incidents",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setIncident: (state, action) => {
      state.entities[action.payload.id] = action.payload
    },
    setIncidents: (state, action) => {
      action.payload.forEach((incident) => {
        state.entities[incident.id] = incident
      })
    },
    setFoundIds: (state, action) => {
      state.foundIds = action.payload
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    }
  }
})

export const { setLoading, setFoundIds, setIncidents, setIncident, setCurrentPage, setTotalPages, setSearchQuery } = incidentsSlice.actions

export default incidentsSlice.reducer

export const toggleAttached = (incident) => async (dispatch, getState) => {
  const { settings, ticket } = getState()
  const attached = incident.zendesk_ticket_id === ticket.id
  const changedAttributes = {
    zendesk_ticket_id: attached ? null : ticket.id,
    zendesk_ticket_url: attached ? null : ticket.url,
  }
  dispatch(setIncident({ ...incident, syncing: true }))
  const { data, meta } = await rootlyApiClient(settings).patch(`/incidents/${incident.id}`, {
    data: {
      type: "incidents",
      attributes: changedAttributes,
    }
  })
  dispatch(setIncident({ ...incident, ...changedAttributes, syncing: false }))
}

export const loadIncidents = () => async (dispatch, getState) => {
  setLoading(true)
  Promise.all([
    dispatch(loadAttachedIncidents()),
    dispatch(loadRecentIncidents()),
  ])
  .then(() => dispatch(setLoading(false)))
}

export const loadAttachedIncidents = () => async (dispatch, getState) => {
  const { settings, ticket } = getState()
  const { data, meta } = await rootlyApiClient(settings).get(`/incidents?sort[started_at]=desc&page[size]=1000&filter[zendesk_ticket_id]=${ticket.id}`)
  const incidents = data.map(({ id, attributes }) => ({ id, ...attributes }))
  dispatch(setIncidents(incidents))
}

export const loadRecentIncidents = () => async (dispatch, getState) => {
  const { settings, ticket } = getState()
  const { data, meta } = await rootlyApiClient(settings).get(`/incidents?sort[started_at]=desc&page[size]=5&page[number]=1`)
  const incidents = data.map(({ id, attributes }) => ({ id, ...attributes }))
  dispatch(setIncidents(incidents))
  dispatch(setFoundIds(incidents.map(({ id }) => id)))
  dispatch(setCurrentPage(1))
  dispatch(setTotalPages(meta.total_pages))
}

export const searchIncidents = (query) => async (dispatch, getState) => {
  const { settings, ticket } = getState()
  const { data, meta } = await rootlyApiClient(settings).get(`/incidents?sort[started_at]=desc&page[size]=5&page[number]=1&filter[search]=${query}`)
  const incidents = data.map(({ id, attributes }) => ({ id, ...attributes }))
  dispatch(setSearchQuery(query))
  dispatch(setIncidents(incidents))
  dispatch(setFoundIds(incidents.map(({ id }) => id)))
  dispatch(setCurrentPage(1))
  dispatch(setTotalPages(meta.total_pages))
}

export const paginateIncidents = (page) => async (dispatch, getState) => {
  dispatch(setCurrentPage(page))
  const { incidents: { searchQuery }, settings, ticket } = getState()
  const { data, meta } = await rootlyApiClient(settings).get(`/incidents?sort[started_at]=desc&page[size]=5&page[number]=${page}&filter[search]=${searchQuery}`)
  const incidents = data.map(({ id, attributes }) => ({ id, ...attributes }))
  dispatch(setIncidents(incidents))
  dispatch(setFoundIds(incidents.map(({ id }) => id)))
}

export const createIncident = () => async (dispatch, getState) => {
  dispatch(setIncident({ id: "new", syncing: true }))
  const { settings, ticket } = getState()
  const { data, meta } = await rootlyApiClient(settings).post("/incidents", {
    data: {
      type: "incidents",
      attributes: {
        title: ticket.subject,
        zendesk_ticket_id: ticket.id,
        zendesk_ticket_url: ticket.url,
      }
    }
  })
  dispatch(setIncident({ id: data.id, ...data.attributes }))
  dispatch(setIncident({ id: "new", syncing: false }))
}
