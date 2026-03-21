# Doodle Chat Challenge

This repository is structured to make the frontend review straightforward while keeping the provided API close at hand for local development. The frontend is the authored deliverable. The backend is included as an upstream dependency and remains unchanged.

## Why The Repo Has Two Apps

- `apps/web` contains the React + TypeScript frontend implementation.
- `apps/api` contains the provided Doodle chat API used as a local runtime dependency.

This layout reduces reviewer setup friction without blurring ownership. The goal is to make it obvious what was built for the challenge and what was supplied as supporting infrastructure.

## Repository Layout

```text
.
├── apps
│   ├── api    # Provided upstream chat API, kept unchanged
│   └── web    # Authored frontend application
├── docs
│   ├── reference
│   │   ├── backend-brief.md
│   │   └── challenge-brief.md
│   └── solution-design.md
└── README.md
```

## Ownership

- `apps/web` is the implementation under review.
- `apps/api` is the provided backend dependency.
- `docs/solution-design.md` explains the reasoning behind the frontend delivery strategy and architecture choices.

## Quick Start

1. Install root tooling:

   ```bash
   npm install
   ```

2. Install app dependencies:

   ```bash
   npm run install:all
   ```

3. Configure the backend:

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

4. Configure the frontend:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

5. Run the API and frontend in separate terminals:

   ```bash
   npm run dev:api
   npm run dev:web
   ```

   Or run both from the root:

   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` starts both apps together.
- `npm run dev:api` starts the provided API.
- `npm run dev:web` starts the frontend scaffold.
- `npm run build:web` builds the frontend.
- `npm run lint:web` lints the frontend.

## Current Checkpoint

This repository currently covers the first three implementation steps:

- monorepo structure and ownership boundaries
- reviewer-facing documentation
- frontend scaffold with SOLID-friendly component boundaries

API integration and chat behavior come next, after this checkpoint is reviewed.
# doodle-chalange-app
