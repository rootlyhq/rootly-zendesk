import React from 'react'
import { createRoot } from 'react-dom/client'
import I18n from '../../javascripts/lib/i18n'
import App from '../../javascripts/components/app'
import RootlyApi from '../../javascripts/lib/rootly-api'

export async function start (zafClient, root) {
  const currentUser = (await zafClient.get('currentUser')).currentUser

  if (!root) {
    root = createRoot(document.querySelector('.main'))
  }

  I18n.loadTranslations(currentUser.locale)

  await RootlyApi.initialize(zafClient)

  const subdomain = await zafClient.context().then(({ account: { subdomain } }) => subdomain)
  const ticket = await zafClient.get('ticket').then(({ ticket }) => ticket)

  ticket.id = ticket.id.toString()
  ticket.url = `https://${subdomain}.zendesk.com/agent/tickets/${ticket.id}`

  root.render(<App ticket={ticket} zafClient={zafClient} />)
}
