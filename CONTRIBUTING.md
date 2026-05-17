# Contributing

Thanks for your interest in contributing to AI Merch Store.

## Development Setup

1. Fork and clone the repo
2. Run `npm install`
3. Copy `.env.example` to `.env.local` and fill in your API keys
4. Run the database schema in your Supabase SQL Editor (`schema.sql`)
5. Run `npm run dev`

## Pull Requests

- Create a feature branch from `init`
- Keep changes focused — one feature or fix per PR
- Run `npm run lint` and `npm run build` before submitting
- Write clear commit messages

## Code Style

- TypeScript strict mode
- Follow existing patterns in the codebase
- Use shadcn/ui components for UI elements
- Keep API routes in `src/app/api/`

## Reporting Issues

Open a GitHub issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser/Node version if relevant
