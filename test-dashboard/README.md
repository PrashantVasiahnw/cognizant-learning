# Test Dashboard

A modern React 18 + TypeScript dashboard scaffold built with Vite. The project includes:

- Axios with a centralized instance and interceptors
- TanStack Query for server-state management
- Bootstrap 5 for responsive UI primitives
- Recharts for dynamic, backend-driven charts
- Storybook for isolated component development
- Safe environment variable access with typed Vite env support

## Scripts

- `npm run dev` starts the Vite app
- `npm run build` runs TypeScript checks and the production build
- `npm run preview` previews the production build
- `npm run storybook` starts Storybook on port 6006
- `npm run build-storybook` creates a static Storybook build

## Environment Variables

The app ships with `.env`, `.env.development`, and `.env.production`.

- `VITE_API_BASE_URL` sets the Axios base URL
- `VITE_USE_MOCK_API` controls whether the app uses the built-in mock API
- `VITE_PAGE_SIZE` controls infinite-query pagination size

The default setup uses the mock API so the app runs out of the box.

## Architecture Notes

- `src/api` contains Axios and TanStack Query hooks
- `src/services` contains data-access services and mock responses
- `src/components` contains reusable presentational pieces
- `src/pages` contains route-level composition
- `src/types` contains shared TypeScript contracts
- `src/utils/env.ts` is the single safe access point for Vite env variables

## Pagination And Detail Loading

- Dashboard rows are fetched in batches of 50 through `useInfiniteQuery`
- The next page loads through either the explicit button or the scroll sentinel
- Clicking a row opens a Bootstrap-style modal and loads row details through `useQuery`

## Storybook

Stories are included for the table, modal, and chart components. All stories use mock data only and do not perform live API requests.
