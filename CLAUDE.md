# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite HMR
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview the production build locally

## Architecture Overview

This is an Airbnb clone built with React, TypeScript, and Vite using a feature-based architecture:

### Project Structure

- **src/app/** - Application entry point and main App component with routing
- **src/features/** - Feature modules organized by domain (currently `properties`)
  - Each feature contains: `api/`, `hooks/`, `model/`, `ui/` subdirectories
  - Uses barrel exports via `index.ts` files
- **src/shared/** - Shared utilities and components across features
  - `api/` - HTTP client configuration with axios and retry logic
  - `config/` - OIDC authentication configuration
  - `hooks/` - Auth context and authentication hooks
  - `ui/` - Shared UI components (LoadingSpinner, PrivateRoute, etc.)
- **src/pages/** - Page components (HomePage, PropertyDetailsPage, ChatPage, etc.)

### Key Technologies & Patterns

- **State Management**: Zustand for local state (see `features/properties/model/store.ts`)
- **Authentication**: OIDC with react-oidc-context for OAuth2/OpenID Connect
- **HTTP Client**: Axios with retry logic and request/response interceptors
- **Routing**: React Router with lazy loading and private routes
- **Styling**: CSS modules for component-specific styles

### Authentication Flow

- Uses OIDC configuration pointing to `localhost:9443` identity provider
- Includes silent renewal and automatic token refresh
- Bearer token automatically added to API requests via axios interceptor
- Auth context wraps the entire application

### API Integration

- Base API URL configured to use ngrok tunnel (`91c48a924bb9.ngrok-free.app`)
- Automatic retry on 500 errors with exponential backoff
- Request/response logging via custom logger
- Bearer token authentication for protected endpoints

### Module Federation Setup

- Configured as a **shell app** using `@originjs/vite-plugin-federation`
- Named `airbnb-shell` for module federation
- Shared dependencies: react, react-dom, react-router-dom
- Ready to consume remote microfrontends via the `remotes` configuration
- Build generates federation assets for module sharing

### Development Notes

- Uses TypeScript with project references (app and node configs)
- ESLint configured for React and TypeScript
- Vite with SWC for fast builds and HMR
- Lazy loading for page components to optimize bundle size
- Module federation build target set to `esnext` for compatibility