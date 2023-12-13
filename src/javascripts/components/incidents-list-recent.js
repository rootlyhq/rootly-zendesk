import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { paginateIncidents, searchIncidents } from '../../javascripts/redux/slices/incidents'
import { Field, Label, MediaInput } from '@zendeskgarden/react-forms'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { MD, Paragraph, Span } from '@zendeskgarden/react-typography'
import { Pagination } from '@zendeskgarden/react-pagination'
import SearchIcon from '@zendeskgarden/svg-icons/src/16/search-stroke.svg'
import I18n from '../../javascripts/lib/i18n'
import { debounce } from '../../javascripts/lib/helpers'
import Card from '../../javascripts/components/card'
import IncidentsListItem from '../../javascripts/components/incidents-list-item'

export default function IncidentsListRecent() {
  const dispatch = useDispatch()
  const { entities, foundIds, totalPages, currentPage } = useSelector((state) => state.incidents)
  const ticket = useSelector((state) => state.ticket)
  const found = foundIds.map((id) => entities[id])

  const debouncedSearchIncidents = debounce((ev) => dispatch(searchIncidents(ev.target.value)), 250)

  return (
    <Grid gutters={false}>
      <Row>
        <Col>
          <MD>{I18n.t("incidents.recent.header")}</MD>
        </Col>
      </Row>
      <Row>
        <Col>
          <Field>
            <Label style={{display: "none"}}>{I18n.t("incidents.recent.search")}</Label>
            <MediaInput start={<SearchIcon />} onInput={debouncedSearchIncidents} />
          </Field>
        </Col>
      </Row>
      <Row>
        <Col>
          {found.length > 0
          ? found.map((incident) => <IncidentsListItem key={`recent-${incident.id}`} incident={incident} />)
          : <NoIncidentsFoundCard />}
        </Col>
      </Row>
      <Row>
        <Col>
          {totalPages > 0 && <Pagination totalPages={totalPages} pagePadding={0} currentPage={currentPage} onChange={(page) => dispatch(paginateIncidents(page))} style={{margin: ".5em 0"}} />}
        </Col>
      </Row>
    </Grid>
  )
}

function NoIncidentsFoundCard() {
  const query = useSelector((state) => state.incidents.searchQuery)

  return (
    <Card>
      <Paragraph style={{textAlign: "center"}}>
        {query
        ? <Span hue="grey">{I18n.t("incidents.recent.none_found", {query})}</Span>
        : <Span hue="grey">{I18n.t("incidents.recent.none")}</Span>}
      </Paragraph>
    </Card>
  )
}
