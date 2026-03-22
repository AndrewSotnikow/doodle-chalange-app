# Solution Design

## Goal

The goal of this submission is to solve the Doodle frontend challenge with a clean React + TypeScript chat interface while making engineering judgment visible to the reviewer. The implementation is intentionally structured to highlight separation of concerns, pragmatic scope control, accessibility, and testability.

## Final Implementation Summary

The frontend provides:

- message loading from the provided API
- message creation through a typed service layer
- chronological rendering of the conversation
- clear loading, empty, retry, and submission states
- keyboard-friendly composer behavior
- responsive layout for desktop and mobile
- focused tests at the mapper, API, hook, and component layers

## Why `Vite + React + TypeScript`

I chose Vite with React and TypeScript because it satisfies the challenge requirements with the smallest operational surface area.

- React + TypeScript are explicitly requested in the brief
- the app is interaction-heavy and authenticated, so SSR would not materially improve the review target
- Vite keeps local iteration fast and the tooling lightweight

Using Next.js here would add routing and rendering complexity without improving the core chat experience being evaluated.

## Why Keep Both Apps In One Repository

The frontend is the deliverable under review, but the backend is necessary to run and validate it. Keeping both applications in one repository improves reviewer ergonomics while preserving ownership boundaries:

- `apps/web` contains the authored frontend code
- `apps/api` contains the provided backend contract with a small dev-only in-memory fallback for easier local setup

This is a delivery decision for the challenge, not a claim that a production codebase should always be organized this way.

## Architecture

The frontend is split into four explicit layers:

### 1. Service Layer

Files:

- `apps/web/src/api/requestJson.ts`
- `apps/web/src/features/chat/api/chatApi.ts`
- `apps/web/src/features/chat/api/chatMappers.ts`

Responsibilities:

- build typed requests
- normalize backend payloads into frontend-friendly message objects
- centralize transport and API error handling
- keep `_id` to `id` mapping and ordering logic out of UI code

### 2. State Layer

File:

- `apps/web/src/features/chat/hooks/useChatState.ts`

Responsibilities:

- fetch initial messages
- handle submission and retry flows
- track loading and submit state
- expose UI-ready status strings
- preserve author state after successful sends

### 3. Component Layer

Files:

- `ChatScreen`
- `MessageList`
- `MessageBubble`
- `MessageComposer`
- `ChatNotice`

Responsibilities:

- render only the state they receive
- manage local UI interaction only
- avoid direct network concerns
- keep contracts narrow and composable

### 4. Utility And Formatting Layer

Files:

- `formatMessageTimestamp`
- `cx`

Responsibilities:

- isolate formatting and small view helpers from the component tree

## SOLID In Practice

The codebase uses SOLID as a practical frontend constraint rather than a slogan.

### Single Responsibility

- `MessageList` renders the feed and its states
- `MessageComposer` handles form interaction and submission triggers
- `ChatNotice` standardizes transient notice UI

### Open/Closed

The current screen can grow through composition. New states or wrappers can be added without rewriting the service or state layers.

### Liskov Substitution

UI elements rely on explicit prop contracts rather than hidden ambient state, which keeps components replaceable and easier to test.

### Interface Segregation

Components receive only the state they need. For example, the composer does not receive the entire message list, and the feed does not receive form state.

### Dependency Inversion

The component layer depends on hook/service abstractions instead of `fetch` or backend payload details. Transport concerns stay behind `chatApi` and `requestJson`.

## Accessibility And Responsive Decisions

The final UI includes several challenge-appropriate accessibility and layout choices:

- semantic labels and required fields in the composer
- `aria-live` updates for status changes
- `role="log"` for the message feed
- visible focus states for inputs and actions
- retry affordances for recoverable feed failures
- keyboard submission with `Ctrl/Cmd + Enter`
- mobile-first fallbacks for stacked layout and full-width actions
- a persistent bottom composer dock that stays available while reading the feed

## Testing Strategy

Tests are organized by responsibility rather than by file count.

### Service Tests

These validate transformation and contract logic:

- message payload mapping
- chronological ordering
- outbound input trimming
- request construction and propagated API failures

### Hook Tests

These validate orchestration behavior:

- initial message load
- load failures
- submission flow
- validation failures without API calls

### Component Tests

These validate rendering and user interaction:

- loading, empty, and error states
- retry affordances
- composer input delegation
- button and keyboard submission behavior

## Tradeoffs

- Real-time behavior was not added because the backend documentation does not define a transport beyond REST endpoints.
- The workspace did not include the design assets referenced by the brief, so the final UI is an intentional interpretation instead of a strict visual recreation.
- The backend contract is preserved, but the local dev experience now includes an in-memory fallback so reviewers do not need Docker or MongoDB just to run the submission.

## Future Improvements

If this were extended beyond the challenge scope, the next improvements would be:

- explicit polling or a real-time transport once the backend contract is clarified
- optimistic message sending with rollback
- richer message grouping and date separators
- visual regression coverage or end-to-end browser tests
- persistent user identity across refreshes

## Verification

The current frontend implementation passes:

```bash
npm run test:web
npm run lint:web
npm run build:web
```

The backend implementation also passes:

```bash
npm run lint:api
npm run build:api
```
