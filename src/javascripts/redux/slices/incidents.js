import { createSlice } from '@reduxjs/toolkit'
import rootlyApiClient from '../../lib/rootly-api'
import { setError } from './error'

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
  const { ticket } = getState()
  const attached = incident.zendesk_ticket_id === ticket.id
  const changedAttributes = {
    zendesk_ticket_id: attached ? null : ticket.id,
    zendesk_ticket_url: attached ? null : ticket.url,
  }
  dispatch(setIncident({ ...incident, syncing: true }))
  const { data, meta } = await rootlyApiClient.patch(`/incidents/${incident.id}`, {
    data: {
      type: "incidents",
      attributes: changedAttributes,
    }
  })
  dispatch(setIncident({ ...incident, ...changedAttributes, syncing: false }))
}

export const loadIncidents = () => (dispatch, getState) => {
  setLoading(true)
  return Promise.all([
    dispatch(loadAttachedIncidents()),
    dispatch(loadRecentIncidents()),
  ])
  .then(() => dispatch(setLoading(false)))
  .catch((e) => dispatch(setError(e)))
}

export const loadAttachedIncidents = () => (dispatch, getState) => {
  const { ticket } = getState()
  return rootlyApiClient.get('/incidents', {
    filter: { zendesk_ticket_id: ticket.id },
    page: { size: 1000 },
    sort: { started_at: "desc" },
  })
  .then(({ data, meta }) => {
    const incidents = data.map(({ id, attributes }) => ({ id, ...attributes }))
    dispatch(setIncidents(incidents))
  })
  .catch((e) => dispatch(setError(e)))
}

export const loadRecentIncidents = () => (dispatch, getState) => {
  const { ticket } = getState()
  return rootlyApiClient.get('/incidents', {
    page: { size: 5, number: 1 },
    sort: { started_at: "desc" },
  })
  .then(({ data, meta }) => {
    const incidents = data.map(({ id, attributes }) => ({ id, ...attributes }))
    dispatch(setIncidents(incidents))
    dispatch(setFoundIds(incidents.map(({ id }) => id)))
    dispatch(setCurrentPage(1))
    dispatch(setTotalPages(meta.total_pages))
  })
  .catch((e) => dispatch(setError(e)))
}

export const searchIncidents = (query) => (dispatch, getState) => {
  const { ticket } = getState()
  return rootlyApiClient.get('/incidents', {
    filter: { search: query },
    page: { size: 5, number: 1 },
    sort: { started_at: "desc" },
  })
  .then(({ data, meta }) => {
    const incidents = data.map(({ id, attributes }) => ({ id, ...attributes }))
    dispatch(setSearchQuery(query))
    dispatch(setIncidents(incidents))
    dispatch(setFoundIds(incidents.map(({ id }) => id)))
    dispatch(setCurrentPage(1))
    dispatch(setTotalPages(meta.total_pages))
  })
  .catch((e) => dispatch(setError(e)))
}

export const paginateIncidents = (page) =>(dispatch, getState) => {
  const { incidents: { searchQuery, currentPage: oldPage }, ticket } = getState()

  dispatch(setCurrentPage(page))

  return rootlyApiClient.get('/incidents', {
    filter: { search: searchQuery },
    page: { size: 5, number: page },
    sort: { started_at: "desc" },
  })
  .then(({ data, meta }) => {
    const incidents = data.map(({ id, attributes }) => ({ id, ...attributes }))
    dispatch(setIncidents(incidents))
    dispatch(setFoundIds(incidents.map(({ id }) => id)))
  })
  .catch((e) => {
    dispatch(setCurrentPage(oldPage))
    dispatch(setError(e))
  })
}

export const createIncident = () => (dispatch, getState) => {
  dispatch(setIncident({ id: "new", syncing: true }))
  const { ticket } = getState()
  return rootlyApiClient.post("/incidents", {
    data: {
      type: "incidents",
      attributes: {
        title: ticket.subject,
        zendesk_ticket_id: ticket.id,
        zendesk_ticket_url: ticket.url,
      }
    }
  })
  .then(({ data, meta }) => {
    dispatch(setIncident({ id: data.id, ...data.attributes }))
    dispatch(setIncident({ id: "new", syncing: false }))
  })
  .catch((e) => {
    dispatch(setIncident({ id: "new", syncing: false }))
    dispatch(setError(e))
  })
}
