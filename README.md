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

| Layer | Technology |
| --- | --- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) · [React 19](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) · [shadcn/ui](https://ui.shadcn.com/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + RLS) |
| **AI — Image Gen** | [HuggingFace FLUX.1](https://huggingface.co/black-forest-labs/FLUX.1-dev) |
| **AI — Prompt** | [Google Gemini](https://ai.google.dev/) |
| **Fulfillment** | [Printful API](https://developers.printful.com/) |
| **State** | [Zustand](https://zustand.docs.pmnd.rs/) |

---

## 📁 Project Structure

```
ai-merch-store/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # 🏠 Homepage — prompt input & generation
│   │   ├── select-product/page.tsx     # 🛍 Product selection page
│   │   └── api/
│   │       ├── generate/route.ts       # 🎨 AI image generation endpoint
│   │       ├── printful/
│   │       │   ├── products/route.ts   # 📦 Fetch Printful catalog
│   │       │   └── create-order/route.ts # 🛒 Create Printful order
│   │       └── test-db/route.ts        # 🔍 Database connection test
│   ├── components/ui/                  # 🧩 shadcn/ui components
│   └── lib/
│       ├── printful.ts                 # 🔌 Printful API client
│       └── utils.ts                    # 🔧 Utility functions
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

# 5. Start the dev server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** and start creating! 🎉

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root (or copy `.env.example`):

| Variable | Description | Required |
| --- | --- | :---: |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public API key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | ✅ |
| `HF_API_KEY` | HuggingFace API token for FLUX.1 image generation | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key for prompt enhancement | ✅ |
| `PRINTFUL_API_KEY` | Printful API key for product catalog & order creation | ✅ |

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
- [ ] User dashboard with design history
- [ ] Shopping cart & checkout flow
- [ ] Stripe payment processing
- [ ] Design gallery / marketplace
- [ ] Multiple AI model support
- [ ] Design editing & customization tools

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Motasem-2000">Motasem Abu Jazar</a>
</p>
