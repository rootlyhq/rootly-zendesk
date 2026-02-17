# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Zendesk App Framework (ZAF) v2 app that integrates Rootly incident management into Zendesk's ticket sidebar. It allows support agents to view, search, create, and attach/detach Rootly incidents directly from Zendesk tickets.

## Commands

- `yarn install` — install dependencies
- `yarn run watch` — build in dev mode with file watching (then run `zcli apps:server dist` in another terminal)
- `yarn start` — shortcut for `zcli apps:server dist` (serves built app to Zendesk with `?zcli_apps=true`)
- `yarn run build` — production build (output to `dist/`)
- `yarn test` — run Jest tests
- `yarn lint` — run StandardJS linter

## Architecture

**Zendesk App Framework (ZAF):** The app runs inside a Zendesk iframe in the ticket sidebar location. Entry point is `src/javascripts/locations/ticket_sidebar.js`, which initializes the ZAF client and calls `startApp()` from `src/javascripts/modules/app.js`.

**React + Redux Toolkit:** The UI is built with React 18 and state is managed via Redux Toolkit (`@reduxjs/toolkit`). The store is created per-render in the root `App` component with preloaded ticket state. Redux slices live in `src/javascripts/redux/slices/`:
- `incidents.js` — core slice managing incident entities (normalized by ID), search, pagination, and all async thunks (load, search, paginate, create, toggleAttached)
- `ticket.js` — current Zendesk ticket data
- `settings.js` — API configuration
- `error.js` — error state for API failures

**Rootly API Client:** `src/javascripts/lib/rootly-api.js` is a singleton that handles all API communication. It has two request modes:
- **ZAF Proxy** (production): uses `zafClient.request()` with `secure: true` to keep the API key hidden via `{{setting.apiKey}}` template
- **Direct Fetch** (development): uses `fetch()` with the API key directly when running against non-production API URLs

**UI Components:** Uses `@zendeskgarden/react-*` component library (v8) with `styled-components` for theming. Components are in `src/javascripts/components/`.

**I18n:** Translations are in `src/translations/en.json`. Custom webpack loaders in `webpack/` handle translation processing at build time. The `I18n` module (`src/javascripts/lib/i18n.js`) provides a `t(key, vars)` function for lookups.

**App Manifest:** `src/manifest.json` defines the app metadata, the `ticket_sidebar` location, whitelisted domain (`api.rootly.com`), and two parameters: `apiUrl` (hidden, defaults to `https://api.rootly.com/v1`) and `apiKey` (required, secure).

## Testing

Tests use Jest with jsdom environment. Specs live in `spec/`. The ZAF client is mocked in `spec/mocks/mock.js`. The test suite mocks `window.fetch` to return empty incident data.

## Linting

Uses [StandardJS](https://standardjs.com/) style — no semicolons, no configuration needed. Run `yarn lint` to check.

## Deployment

Build with `yarn run build`, then use Zendesk CLI:
- `zcli apps:validate dist` — validate before upload
- `zcli apps:create dist` — first-time upload
- `zcli apps:update dist` — update existing app
- `zcli apps:package dist` — create zip for manual upload
