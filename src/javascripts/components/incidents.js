import React from 'react'
import { useSelector } from 'react-redux'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { Spinner } from '@zendeskgarden/react-loaders'
import IncidentsListAttached from '../../javascripts/components/incidents-list-attached'
import IncidentsListRecent from '../../javascripts/components/incidents-list-recent'
import ErrorNotice from '../../javascripts/components/error-notice'

export default function Incidents() {
  const loading = useSelector((state) => state.incidents.loading)

  if (loading) return (
    <Grid>
      <Row>
        <Col textAlign="center">
          <Spinner size="32" />
        </Col>
      </Row>
    </Grid>
  )

  return (
    <Grid gutters="xs">
      <Row>
        <Col>
          <ErrorNotice />
          <IncidentsListAttached />
          <IncidentsListRecent />
        </Col>
      </Row>
    </Grid>
  )
}
