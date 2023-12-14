import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Anchor, Button } from '@zendeskgarden/react-buttons'
import { Row, Col } from '@zendeskgarden/react-grid'
import { Span } from '@zendeskgarden/react-typography'
import { Tag } from '@zendeskgarden/react-tags'
import { Dots } from '@zendeskgarden/react-loaders'
import PlusIcon from '@zendeskgarden/svg-icons/src/12/plus-fill.svg';
import MinusIcon from '@zendeskgarden/svg-icons/src/12/dash-fill.svg';
import I18n from '../../javascripts/lib/i18n'
import { toggleAttached } from '../../javascripts/redux/slices/incidents'
import Card from '../../javascripts/components/card'

export default function IncidentsListItem({ incident }) {
  const dispatch = useDispatch()
  const syncing = useSelector((state) => state.incidents.entities[incident.id].syncing)
  const ticket = useSelector((state) => state.ticket)
  const attached = incident.zendesk_ticket_id === ticket.id
  const startedAtDate = new Date(incident.started_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
  const startedAtTime = new Date(incident.started_at).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric"
  })

  return (
    <Card>
      <Row alignItems="center" justifyContent="between">
        <Col size={9}>
          <Row>
            <Anchor href={incident.url} isExternal>
              <Span isBold>#{incident.sequential_id}</Span> {incident.title}
            </Anchor>
          </Row>
          <Row alignItems="center">
            <Tag isPill style={{margin: "1em 1em 0 0"}} hue={statusHue(incident.status)}>{formattedStatus(incident.status)}</Tag>
            {incident.severity && <Tag isPill style={{margin: "1em 1em 0 0"}} hue={statusHue(incident.severity.data.attributes.severity)}>{incident.severity.data.attributes.name}</Tag>}
          </Row>
          <Row alignItems="center">
            <Span hue="grey" size="small" style={{marginTop: "1em"}}>{startedAtDate} {startedAtTime}</Span>
          </Row>
        </Col>
        <Col size={3} textAlign="end">
          <Button onClick={() => dispatch(toggleAttached(incident))} size="small" style={{flex: "none"}}>
            <Button.StartIcon>{syncing ? (<Dots />) : (attached ? <MinusIcon /> : <PlusIcon />)}</Button.StartIcon>
            {I18n.t(`buttons.${attached ? "detach" : "attach"}${syncing ? "ing" : ""}`)}
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

function formattedStatus(status) {
  switch (status) {
    case 'started':
      return 'Active'
    default:
      return status[0].toUpperCase() + status.slice(1)
  }
}

function statusHue(status) {
  switch (status) {
    case 'started':
      return 'blue'
    case 'mitigated':
      return 'yellow'
    case 'resolved':
      return 'green'
    default:
      return 'grey'
  }
}
