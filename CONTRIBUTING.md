# 🤝 Contributing to AI Merch Factory

Thank you for your interest in contributing! This guide will help you get started.

---

## 📋 Table of Contents

- [Development Setup](#-development-setup)
- [Branch Naming](#-branch-naming)
- [Opening Issues](#-opening-issues)
- [Pull Request Process](#-pull-request-process)
- [Code Style](#-code-style)
- [Commit Messages](#-commit-messages)
- [Project Guidelines](#-project-guidelines)

---

## 🛠 Development Setup

1. **Fork the repository** and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/ai-merch-store.git
   cd ai-merch-store
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your API keys — see the [README](README.md#-environment-variables) for details.

4. **Set up the database:**

   Run the contents of `schema.sql` in your Supabase project's SQL Editor.

5. **Start the dev server:**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🌿 Branch Naming

Use the following prefixes for your branches:

| Prefix | Use Case | Example |
| --- | --- | --- |
| `feature/` | New features | `feature/user-dashboard` |
| `fix/` | Bug fixes | `fix/printful-auth-error` |
| `docs/` | Documentation changes | `docs/update-readme` |
| `refactor/` | Code refactoring | `refactor/api-error-handling` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |

---

## 🐛 Opening Issues

When opening an issue, please include:

- **Clear title** describing the problem or feature
- **Steps to reproduce** (for bugs)
- **Expected vs actual behavior** (for bugs)
- **Screenshots** if applicable
- **Environment info** (browser, Node.js version, OS)

Use the appropriate label: `bug`, `enhancement`, `documentation`, or `question`.

---

## 🔄 Pull Request Process

1. **Create a branch** from `init` using the [naming convention](#-branch-naming)
2. **Make your changes** — keep them focused (one feature or fix per PR)
3. **Run checks locally:**

   ```bash
   npm run lint
   npm run build
   ```

4. **Write a clear PR description** explaining what changed and why
5. **Request a review** — at least one approval is required before merging
6. **Address review feedback** promptly

### PR Checklist

Before submitting, ensure:

- [ ] Code compiles without errors (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] No new TypeScript `any` types introduced
- [ ] New environment variables are documented in `.env.example`
- [ ] API routes include proper error handling

---

## 🎨 Code Style

### ESLint

This project uses ESLint with the Next.js configuration. Run the linter with:

```bash
npm run lint
```

### General Guidelines

- **TypeScript** — Use strict types; avoid `any`
- **Imports** — Keep imports at the top of files; use path aliases (`@/`)
- **Components** — Use shadcn/ui for UI elements
- **API Routes** — Place in `src/app/api/`; include error handling with try/catch
- **Naming** — Use PascalCase for components, camelCase for functions/variables
- **Files** — Use kebab-case for file and folder names

---

## 💬 Commit Messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type | Description |
| --- | --- |
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting (no code change) |
| `refactor` | Code restructuring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

### Examples

```
feat(api): add design history endpoint
fix(ui): resolve product card overflow on mobile
docs: update environment variables table
chore: upgrade Next.js to 16.3
```

---

## 📌 Project Guidelines

- **API Keys** — Never commit real API keys. Use `.env.local` for local development and `.env.example` as a template.
- **Database Changes** — Update `schema.sql` for any schema modifications.
- **New Dependencies** — Justify new dependencies in your PR description. Prefer existing libraries already in use.
- **Error Handling** — All API routes must return meaningful error responses with appropriate HTTP status codes.
- **Accessibility** — Use semantic HTML and ensure keyboard navigation works.

---

Thank you for contributing! 🎉
