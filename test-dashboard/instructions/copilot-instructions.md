---
description: "Use when working in the test-dashboard React TypeScript project, especially for components, API integration, dashboard pages, reusable tables, modals, charts, Storybook stories, and environment-variable usage. Enforces React 18 + TypeScript standards, feature separation, TanStack Query server-state patterns, Axios API layering, Bootstrap styling, and reusable component design."
name: "Test Dashboard React Standards"
applyTo: "test-dashboard/**/*.ts, test-dashboard/**/*.tsx"
---
# Test Dashboard React Standards

## General

- Write clean, readable, maintainable, production-ready code.
- Follow React 18 and TypeScript best practices.
- Use functional components only.
- Prefer composition over inheritance.
- Match the existing project architecture and folder structure.
- Do not introduce new libraries unless explicitly requested.

## TypeScript

- Use strict TypeScript patterns.
- Avoid `any` unless there is no practical alternative.
- Define interfaces or types for props, API responses, and custom hooks.
- Keep interfaces out of implementation files whenever practical.
- Place component, hook, and feature interfaces in dedicated `types.ts` files.
- Prefer explicit return types for functions and custom hooks.
- Do not use deprecated React APIs or legacy patterns.

## Architecture

- Keep UI components focused and reusable.
- Keep business logic out of presentational components.
- Separate concerns clearly:
- API logic belongs in `api/`.
- Server-state access belongs in TanStack Query hooks.
- UI components belong in `components/`.
- Pages belong in `pages/`.
- Shared types belong in `types/`.
- Co-located interfaces should live in `types.ts` files inside the relevant feature folder.
- Do not place API calls directly inside UI components.

## Environment

- Use `.env`, `.env.development`, and `.env.production` for configuration.
- All client-side environment variables must start with `VITE_`.
- Access environment variables through `import.meta.env`.
- Never hardcode API base URLs or secrets.

## API

- Use a centralized Axios instance.
- Configure base URL from environment variables.
- Use request and response interceptors where needed.
- Handle API failures consistently with global error handling.
- Never call Axios directly inside components.
- Expose API access through reusable hooks or API-layer helpers.

## Server State

- Use TanStack Query for server-state management.
- Use `useQuery` for standard fetches.
- Use `useInfiniteQuery` or explicit pagination for large tables.
- Fetch records in chunks of 50 by default.
- Handle loading, error, and empty states explicitly.
- Do not duplicate server data into local component state unless required.

## Hooks

- Follow the Rules of Hooks strictly.
- Prefer `useState` for local UI state.
- Use `useMemo` and `useCallback` only when justified.
- Use `useEffect` only for real side effects.
- Always provide correct dependency arrays.
- Custom hook names must start with `use`.

## Dashboard

- Treat the dashboard as the main landing page.
- Fetch dashboard data through query hooks.
- Render tabular data in reusable Bootstrap-based table components.
- Keep pagination or infinite-loading logic inside query hooks, not table components.

## Table And Modal

- Build table components as reusable, strongly typed components.
- Keep business logic out of the table implementation.
- On row click, pass only the selected row ID to modal or detail logic.
- Build modal components as reusable, controlled components.
- Fetch modal detail data through TanStack Query.
- Show loading and error states in detail views.

## Charts And Storybook

- Build charts as reusable components.
- Drive chart configuration from backend data when available.
- Do not hardcode chart series or labels when the backend provides them.
- Use Chart.js or Recharts when charting is required.
- Create Storybook stories for reusable components using mock data only.
- Do not perform live API calls in stories.

## State And Rendering

- Prefer local component state for UI-only concerns.
- Prefer TanStack Query for server state.
- Avoid prop drilling when a clearer composition pattern is available.
- Do not introduce Redux or other global state libraries unless explicitly requested.
- Keep JSX readable.
- Extract large render blocks into smaller components.
- Avoid deeply nested JSX.
- Prefer clear conditional rendering and early returns.
- Use semantic HTML.

## Styling, Performance, And Accessibility

- Use Bootstrap 5 consistently.
- Prefer Bootstrap utility classes over custom one-off styling.
- Avoid inline styles unless necessary.
- Keep layouts responsive.
- Optimize only when needed.
- Use `React.memo`, `useMemo`, and `useCallback` only when they provide a clear benefit.
- Handle API and UI errors with meaningful messages.
- Do not silently swallow errors.
- Use semantic HTML and accessible controls.
- Ensure buttons, links, inputs, labels, keyboard navigation, and screen reader behavior are correct.