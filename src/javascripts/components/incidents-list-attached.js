import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createIncident } from '../../javascripts/redux/slices/incidents'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { MD, Paragraph, Span } from '@zendeskgarden/react-typography'
import { Button } from '@zendeskgarden/react-buttons'
import { Dots } from '@zendeskgarden/react-loaders'
import PlusIcon from '@zendeskgarden/svg-icons/src/12/plus-fill.svg'
import I18n from '../../javascripts/lib/i18n'
import IncidentsListItem from '../../javascripts/components/incidents-list-item'
import Card from '../../javascripts/components/card'

export default function IncidentsListAttached () {
  const loading = useSelector((state) => state.incidents.loading)
  const incidents = useSelector((state) => state.incidents.entities)
  const ticket = useSelector((state) => state.ticket)
  const attached = Object.values(incidents).filter((incident) => incident.zendesk_ticket_id === ticket.id)

  if (attached.length === 0) {
    return <NoAttachedIncidentCard />
  }

  return (
    <Grid gutters={false} style={{ marginBottom: '2em' }}>
      <Row>
        <Col>
          <MD>{I18n.t('incidents.attached.header')}</MD>
        </Col>
      </Row>
      <Row>
        <Col>
          {attached.map((incident) => <IncidentsListItem key={`attached-${incident.id}`} incident={incident} />)}
        </Col>
      </Row>
    </Grid>
  )
}

function NoAttachedIncidentCard () {
  const dispatch = useDispatch()
  const syncing = useSelector((state) => state.incidents.entities.new?.syncing)

  return (
    <Card style={{ marginBottom: '2em' }}>
      <Paragraph style={{ textAlign: 'center', marginBottom: '1em' }}>
        <Span hue='grey'>{I18n.t('incidents.attached.none')}</Span>
      </Paragraph>
      <Col textAlign='center'>
        <Button onClick={() => dispatch(createIncident())} size='small' style={{ flex: 'none' }}>
          <Button.StartIcon>{syncing ? <Dots /> : <PlusIcon />}</Button.StartIcon>
          {I18n.t(`buttons.${syncing ? 'creating_incident' : 'create_incident'}`)}
        </Button>
      </Col>
    </Card>
  )
}
