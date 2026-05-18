# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-05-15

### Added

- Zod schema validation for all API routes (generate, recommendations, printful, checkout, admin)
- Content Security Policy (CSP) and security headers in `next.config.ts`
- Database performance indexes on orders, order_items, products, and designs
- Pagination ("Load More") on the products listing page
- `useCallback` memoization for event handlers in product pages
- Prettier configuration with Tailwind CSS plugin
- Husky pre-commit hooks with lint-staged for automatic linting and formatting
- Build-time environment variable validation (`src/lib/env.ts`)
- Expanded Vitest test suite: API route tests, cart store edge cases
- Playwright E2E test scaffolding
- CHANGELOG.md following Keep a Changelog format
- JSDoc comments on all major functions and API routes
- `format`, `format:check`, and `typecheck` npm scripts

### Changed

- CI workflow now runs lint, format check, type check, and unit tests
- Products listing uses paginated Supabase queries instead of fetching all
- Updated README with Security, Performance, Testing, and CI/CD sections

### Removed

- Unused `openai` dependency (project uses Gemini)

### Security

- Input validation on all API endpoints rejects malformed requests with 400 errors
- CSP headers restrict script, style, image, and connect sources
- HSTS, X-Frame-Options, X-Content-Type-Options headers added
- Verified RLS policies on all database tables

## [0.1.0] - 2025-05-14

### Added

- Initial project setup with Next.js 16, React 19, TypeScript
- AI image generation using HuggingFace FLUX.1
- Prompt enhancement via Google Gemini
- Printful print-on-demand integration
- Product listing and detail pages
- Shopping cart with Zustand (localStorage persistence)
- User authentication via Supabase (email + Google OAuth)
- Checkout flow with order creation in Supabase
- Admin product management with image upload
- AI-powered product recommendations
- Responsive navbar with mobile menu
- Database schema with RLS policies
- 9 Vitest unit tests (cart store + API route)
- README, CONTRIBUTING.md, CODE_OF_CONDUCT.md, LICENSE (MIT)
- GitHub Actions CI workflow (lint + build)
- Vercel deployment configuration
