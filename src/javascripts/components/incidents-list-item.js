import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Anchor, Button } from '@zendeskgarden/react-buttons'
import { Row, Col } from '@zendeskgarden/react-grid'
import { Code, Paragraph, Span } from '@zendeskgarden/react-typography'
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
  const startedAt = new Date(incident.started_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  })

  return (
    <Card>
      <Row alignItems="center" justifyContent="between">
        <Col size={8}>
          <Paragraph>
            <Anchor href={incident.url} isExternal>
              <Span isBold>#{incident.sequential_id}</Span> {incident.title}
            </Anchor>
          </Paragraph>
          <Paragraph>
            <Tag isPill style={{marginRight: "1em"}}>{formattedStatus(incident.status)}</Tag>
            <Span hue="grey" size="small">{startedAt}</Span>
          </Paragraph>
        </Col>
        <Col size={4} textAlign="right">
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
