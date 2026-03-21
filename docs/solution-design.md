# Solution Design

## Problem Framing

The challenge is to build a React + TypeScript chat interface against a provided API, while demonstrating code quality, delivery judgment, and product awareness. The first checkpoint intentionally focuses on structure before feature work so the implementation can grow on top of clear boundaries.

## Why `Vite + React + TypeScript`

I chose Vite with React and TypeScript because it satisfies the challenge requirements with the smallest operational surface area. This challenge is centered on an authenticated, interaction-heavy interface rather than SEO, SSR, or routing complexity. Using Next.js here would increase framework weight without improving the core experience being evaluated.

Vite also improves local iteration speed and keeps the initial scaffold lean. That matters in a time-boxed challenge where the strongest signal is product quality, not infrastructure depth.

## Why Keep Both Apps In One Repository

The frontend is the authored deliverable, but the backend is required to run and validate it. Keeping both apps in one repository reduces setup friction for a reviewer while preserving ownership clarity:

- `apps/web` is the implementation under review.
- `apps/api` is provided upstream code used as a local dependency.

This is a delivery decision, not an architecture claim about how production services should be organized.

## Why SSR Is Out Of Scope

SSR does not materially improve the first version of this challenge:

- the experience is interactive and authenticated
- the critical value is message rendering, composition, and state handling
- the API integration is local and controlled

The complexity budget is better spent on accessibility, responsive behavior, state boundaries, and readable code.

## SOLID Applied To Frontend Components

The component scaffold is intentionally shaped around SOLID principles in practical frontend terms:

- `Single Responsibility`: each component owns one UI concern only
- `Open/Closed`: behavior is extended through composition and props, not by widening components into orchestration layers
- `Liskov Substitution`: small presentational pieces can be swapped without hidden assumptions
- `Interface Segregation`: props stay narrow and explicit
- `Dependency Inversion`: UI components depend on hooks and services, not inline fetch logic

At this checkpoint, that translates into clear separation between:

- app shell and layout
- feature components
- feature hooks
- API/service code
- types and utilities

## Current Checkpoint Scope

This checkpoint intentionally stops before product behavior:

- the repository structure is in place
- the documentation explains ownership and tradeoffs
- the frontend scaffold is ready for API and chat implementation

The next phase will focus on the typed API layer, state orchestration, and the first working chat screen.
