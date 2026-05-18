<p align="center">
  <h1 align="center">🏭 AI Merch Factory</h1>
  <p align="center">
    <strong>Turn text prompts into shipped physical products — powered by AI.</strong>
  </p>
</p>

<p align="center">
  <a href="https://github.com/Motasem-2000/ai-merch-store/actions"><img src="https://img.shields.io/github/actions/workflow/status/Motasem-2000/ai-merch-store/ci.yml?branch=init&style=flat-square" alt="Build Status" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <a href="https://github.com/Motasem-2000/ai-merch-store/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" /></a>
</p>

<p align="center">
  <img src="public/demo.gif" alt="AI Merch Factory Demo" width="700" />
</p>

<p align="center">
  <a href="https://ai-merch-store.vercel.app">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
</p>

🚀 **Live Demo:** [ai-merch-store.vercel.app](https://ai-merch-store.vercel.app)

---

## 📑 Table of Contents

- [🚀 Live Demo](#-live-demo)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🔐 Environment Variables](#-environment-variables)
- [⚙️ How It Works](#️-how-it-works)
- [🗺 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [🔒 Security](#-security)
- [⚡ Performance](#-performance)
- [🧪 Testing](#-testing)
- [🔄 CI/CD](#-cicd)
- [🤖 Built with Devin](#-built-with-devin)
- [📄 License](#-license)

---

## ✨ Features

- 🎨 **AI Image Generation** — Generate unique artwork from text prompts using FLUX.1 (HuggingFace)
- 🧠 **Smart Prompt Enhancement** — Google Gemini refines your prompts for higher-quality image output
- 🛒 **Print-on-Demand Integration** — Browse Printful's product catalog and apply your designs
- 🔐 **Supabase Auth & Database** — Secure user authentication with Row Level Security
- 📱 **Responsive UI** — Modern interface built with Tailwind CSS and shadcn/ui
- 📦 **Automated Fulfillment** — Printful handles printing, packing, and worldwide shipping

---

## 🛠 Tech Stack

| Layer               | Technology                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**       | [Next.js 16](https://nextjs.org/) (App Router) · [React 19](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/) |
| **Styling**         | [Tailwind CSS 4](https://tailwindcss.com/) · [shadcn/ui](https://ui.shadcn.com/)                                                |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + RLS)                                                                            |
| **AI — Image Gen**  | [HuggingFace FLUX.1](https://huggingface.co/black-forest-labs/FLUX.1-dev)                                                       |
| **AI — Prompt**     | [Google Gemini](https://ai.google.dev/)                                                                                         |
| **Fulfillment**     | [Printful API](https://developers.printful.com/)                                                                                |
| **State**           | [Zustand](https://zustand.docs.pmnd.rs/)                                                                                        |

---

## 📁 Project Structure

```
ai-merch-store/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # 🏠 Homepage — prompt input & generation
│   │   ├── products/page.tsx           # 🛍 Product listing grid
│   │   ├── products/[id]/page.tsx      # 📄 Product detail page
│   │   ├── cart/page.tsx               # 🛒 Shopping cart
│   │   ├── checkout/page.tsx           # 💳 Checkout & order placement
│   │   ├── thank-you/page.tsx          # 🎉 Order confirmation
│   │   ├── login/page.tsx              # 🔑 Sign in (email + Google)
│   │   ├── signup/page.tsx             # ✏️ Create account
│   │   ├── admin/products/page.tsx     # 🔧 Admin product management
│   │   ├── select-product/page.tsx     # 🖼 Printful product selection
│   │   └── api/
│   │       ├── generate/route.ts       # 🎨 AI image generation
│   │       ├── recommendations/route.ts # 🤖 AI product recommendations
│   │       ├── test-supabase/route.ts  # 🔍 Supabase connection test
│   │       └── printful/               # 📦 Printful API routes
│   ├── components/
│   │   ├── navbar.tsx                  # 🧭 Responsive navigation bar
│   │   ├── loading-spinner.tsx         # ⏳ Loading states & skeletons
│   │   ├── error-boundary.tsx          # 🛡 Error boundary component
│   │   └── ui/                         # 🧩 shadcn/ui components
│   ├── store/
│   │   └── cartStore.ts                # 🛒 Zustand cart (localStorage)
│   ├── types/
│   │   └── product.ts                  # 📝 TypeScript interfaces
│   └── lib/
│       ├── supabase.ts                 # 🔌 Supabase client
│       ├── printful.ts                 # 🔌 Printful API client
│       └── utils.ts                    # 🔧 Utility functions
├── src/__tests__/                      # 🧪 Vitest test suite
├── schema.sql                          # 🗄 Database schema + RLS policies
├── .env.example                        # 🔐 Environment variable template
├── next.config.ts                      # ⚙️ Next.js configuration
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **npm**
- A [Supabase](https://supabase.com) project
- API keys: [HuggingFace](https://huggingface.co/settings/tokens) · [Google Gemini](https://aistudio.google.com/apikey) · [Printful](https://www.printful.com/dashboard/developer/api-keys)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Motasem-2000/ai-merch-store.git
cd ai-merch-store

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your API keys (see table below)

# 4. Set up the database
# Open your Supabase project → SQL Editor → paste schema.sql → Run

# 5. Set up Supabase Storage (for product images)
# Go to Supabase Dashboard → Storage → Create bucket "product-images" → Set to Public

# 6. Enable Supabase Auth
# Go to Supabase Dashboard → Authentication → Providers → Enable Email and Google

# 7. Start the dev server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** and start creating! 🎉

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root (or copy `.env.example`):

| Variable                        | Description                                           | Required |
| ------------------------------- | ----------------------------------------------------- | :------: |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL                             |    ✅    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public API key                     |    ✅    |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key (server-side only)          |    ✅    |
| `HF_API_KEY`                    | HuggingFace API token for FLUX.1 image generation     |    ✅    |
| `GEMINI_API_KEY`                | Google Gemini API key for prompt enhancement          |    ✅    |
| `PRINTFUL_API_KEY`              | Printful API key for product catalog & order creation |    ✅    |

---

## ⚙️ How It Works

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  1. User     │────▶│  2. Gemini   │────▶│  3. FLUX.1   │────▶│  4. User     │────▶│  5. Printful │
│  enters      │     │  enhances    │     │  generates   │     │  picks       │     │  prints &    │
│  prompt      │     │  the prompt  │     │  the artwork │     │  a product   │     │  ships it    │
└─────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

1. **Describe** — User types a text description of their desired design
2. **Enhance** — Google Gemini refines the prompt with artistic details (lighting, style, composition)
3. **Generate** — FLUX.1 via HuggingFace creates high-quality artwork from the enhanced prompt
4. **Select** — User browses the Printful catalog and picks a product (t-shirt, mug, poster, etc.)
5. **Ship** — Printful handles printing, packaging, and worldwide delivery

---

## 🗺 Roadmap

- [x] AI image generation with FLUX.1
- [x] Prompt enhancement with Google Gemini
- [x] Printful product catalog integration
- [x] Supabase database & auth
- [x] Product listing & detail pages
- [x] Shopping cart with Zustand (localStorage persistence)
- [x] Checkout flow with order management
- [x] AI-powered product recommendations (Gemini)
- [x] Supabase Auth (email + Google OAuth)
- [x] Admin product management with image upload
- [x] Responsive navbar & mobile-friendly UI
- [x] Vitest test suite
- [x] Zod input validation on all API routes
- [x] Security headers (CSP, HSTS, etc.)
- [x] Database indexes for performance
- [x] Pagination for product listing
- [x] CI/CD with GitHub Actions
- [x] Pre-commit hooks (Husky + lint-staged)
- [ ] User dashboard with design history
- [ ] Stripe payment processing
- [ ] Design gallery / marketplace
- [ ] Multiple AI model support
- [ ] Design editing & customization tools

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

---

## 🔒 Security

- **Content Security Policy** — Strict CSP headers restrict script, style, image, and connection sources
- **Input Validation** — All API routes validate input with [Zod](https://zod.dev/) schemas; malformed requests receive `400` errors
- **Security Headers** — HSTS, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy, Permissions-Policy
- **Row Level Security** — All Supabase tables have RLS enabled with granular policies (users can only access their own data)
- **Environment Validation** — Build-time validation of required environment variables via `src/lib/env.ts`

---

## ⚡ Performance

- **Database Indexes** — Composite indexes on `orders (user_id, status)`, `order_items (order_id, product_id)`, `products (name)`, and `products (created_at)`
- **Pagination** — Products listing loads in chunks of 20 with "Load More" functionality
- **Image Optimization** — Next.js `<Image>` component used throughout with proper `sizes` attributes

---

## 🧪 Testing

```bash
npm test             # Run Vitest unit tests
npm run test:e2e     # Run Playwright E2E tests
npm run lint         # ESLint
npm run format:check # Prettier format check
npm run typecheck    # TypeScript type check
npm run build        # Production build
```

The test suite includes:

- **Unit tests** — Cart store (16 tests), validation schemas (17 tests), API routes, environment validation
- **E2E tests** — Navigation flows with Playwright

### Adding Sample Products

You can add products via the admin page (`/admin/products`) after logging in, or via SQL:

```sql
INSERT INTO products (name, description, price, stock)
VALUES
  ('Galaxy T-Shirt', 'AI-generated cosmic design tee', 29.99, 50),
  ('Nebula Mug', 'Ceramic mug with AI space art', 14.99, 100),
  ('Abstract Poster', 'Wall art generated by AI', 19.99, 30);
```

---

## 🔄 CI/CD

The project uses **GitHub Actions** for continuous integration:

- **Lint** — ESLint checks on all TypeScript/JavaScript files
- **Format** — Prettier format verification
- **Type Check** — TypeScript compiler validation
- **Unit Tests** — Vitest test suite
- **Build** — Next.js production build

The workflow runs on every push to `main`/`init` and on pull requests. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

Pre-commit hooks (via [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)) automatically run linting and formatting before each commit.

---

## 🤖 Built with Devin

This project was built with the help of [Devin](https://devin.ai), an AI software engineering assistant by Cognition AI.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Motasem-2000">Motasem Abu Jazar</a>
</p>
