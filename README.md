# Doodle Chat Challenge

This repository contains my submission for the Doodle frontend challenge. The frontend lives in `apps/web`. The backend in `apps/api` started from the provided upstream API and includes a small development-only fallback so the project can run locally without Docker or a separately installed MongoDB instance.

## What Is Included

- A React + TypeScript chat interface built with Vite
- A typed API layer for message listing and creation
- A dedicated state hook for initial load, send, retry, pagination, polling, and status handling
- Cursor-based pagination for loading earlier messages
- Background polling for newer messages using the existing `after` query parameter
- Focused UI components for feed, composer, message bubbles, and notices
- Responsive and accessibility-focused UI polish
- Layered tests for mappers, API client behavior, hooks, and components

## Repository Layout

```text
.
├── apps
│   ├── api    # Provided Doodle API with a dev-only in-memory fallback
│   └── web    # Frontend implementation under review
├── docs
│   ├── reference
│   │   ├── backend-brief.md
│   │   └── challenge-brief.md
│   └── solution-design.md
└── README.md
```

## Ownership

- `apps/web` is the authored deliverable.
- `apps/api` remains close to the provided backend contract, with a small development-only in-memory fallback added to simplify local setup.
- [`docs/solution-design.md`](docs/solution-design.md) explains the technical decisions and tradeoffs behind the implementation.

## Prerequisites

- Node.js `>= 22`
- npm `>= 10`

## Quick Start

### Recommended Review Path

1. Install root dependencies:

   ```bash
   npm install
   ```

2. Install app dependencies:

   ```bash
   npm run install:all
   ```

3. Configure the frontend:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

4. Start the full local stack from the repository root:

   ```bash
   npm run dev
   ```

   This command now:
   - starts the API and frontend together
   - uses MongoDB automatically if you already have it running locally
   - otherwise falls back to an in-memory message store in development

5. Open the app at `http://localhost:5173`.

### What To Check As A Reviewer

Once the app is running:

- the latest messages should load automatically
- sending a message should append it to the feed
- `Ctrl/Cmd + Enter` should submit from the composer
- `Load earlier messages` should page older results into the feed
- new messages from other senders should appear without a manual refresh through background polling
- disabling the API should surface a retry state instead of a blank screen

### Optional Persistent Local API Path

If MongoDB is already running locally, the same `npm run dev` command will use it automatically. You can also start each process separately:

```bash
cp apps/api/.env.example apps/api/.env
npm run dev:api
npm run dev:web
```

If MongoDB is not running, the API still starts in development with seeded in-memory data.

## Review Notes

- Swagger docs for the backend are available at `http://localhost:3000/api/v1/docs`
- The frontend uses `VITE_API_BASE_URL` and `VITE_API_TOKEN` from `apps/web/.env.local`
- The composer supports `Ctrl/Cmd + Enter` for quick send
- Sent messages keep the active author name in place for consecutive posting
- The feed initially loads the latest page, supports loading older messages, and polls for new messages every `10s`
- Development mode uses an in-memory API store when MongoDB is unavailable, so sent messages are reset when the API restarts

## Background Polling

The chat stays up to date without a manual refresh by polling the existing REST API every `10s`.

- The initial feed load uses `before=<now>` to fetch the latest page.
- Older messages are loaded with `before=<oldestVisibleMessage>`.
- New messages are fetched in the background with `after=<latestVisibleMessage>`.
- Poll results are merged by message `id`, so duplicate payloads do not create duplicate entries in the UI.
- Polling is intentionally silent on failure and does not interrupt the user with transient background errors.
- The implementation avoids overlapping poll requests and skips hidden browser tabs to keep the behavior lightweight.

## Available Commands

- `npm run dev` starts the API and frontend together
- `npm run dev:web` starts the frontend
- `npm run dev:api` starts the API and uses MongoDB when available, otherwise in-memory storage in development
- `npm run build:web` builds the frontend
- `npm run lint:web` lints the frontend
- `npm run test:web` runs the frontend test suite

## Implementation Highlights

- Typed service boundary:
  `apps/web/src/features/chat/api`
- State orchestration:
  `apps/web/src/features/chat/hooks/useChatState.ts`
- Focused UI components:
  `apps/web/src/features/chat/components`
- Cursor usage:
  initial load uses `before`, pagination uses `before`, and background updates use `after`
- Tests by responsibility:
  mapper/API tests, hook tests, and component tests

## Validation

The frontend has been verified with:

```bash
npm run test:web
npm run lint:web
npm run build:web
```

## Tradeoffs And Known Limitations

- The backend only exposes REST endpoints, so the app uses client-side polling rather than WebSockets or Server-Sent Events.
- Background updates are intentionally lightweight and happen every `10s`; this favors a simpler challenge implementation over a more complex push transport.
- The brief references design assets that were not present in this workspace, so the final UI is a reasoned visual interpretation rather than an asset-matched reconstruction.
- The backend contract is preserved, but local development now includes an in-memory fallback so reviewers do not need Docker or a separate MongoDB installation.

## Further Reading

- [Solution design](docs/solution-design.md)
- [Original frontend brief](docs/reference/challenge-brief.md)
- [Provided backend brief](docs/reference/backend-brief.md)
