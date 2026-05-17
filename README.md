# AI Merch Store

AI-powered merchandise store that converts text prompts into printable product designs. Users describe what they want, the AI generates artwork using FLUX.1 (with Gemini-enhanced prompts), and products are fulfilled through Printful.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Database & Auth:** Supabase (PostgreSQL + Row Level Security)
- **AI:** HuggingFace FLUX.1 (image generation), Google Gemini (prompt enhancement)
- **Fulfillment:** Printful API (print-on-demand)
- **State:** Zustand

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A [Supabase](https://supabase.com) project
- API keys for [HuggingFace](https://huggingface.co/settings/tokens), [Google Gemini](https://aistudio.google.com/apikey), and [Printful](https://www.printful.com/dashboard/developer/api-keys)

### Setup

1. **Clone and install:**

   ```bash
   git clone https://github.com/Motasem-2000/ai-merch-store.git
   cd ai-merch-store
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your API keys in `.env.local`.

3. **Set up the database:**

   Open your Supabase project's **SQL Editor** and run the contents of `schema.sql`. This creates the tables (`profiles`, `designs`, `products`, `orders`) and enables Row Level Security policies.

4. **Start the dev server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage with prompt input
│   ├── select-product/page.tsx   # Product selection page
│   └── api/
│       ├── generate/route.ts     # AI image generation endpoint
│       ├── printful/             # Printful product & order APIs
│       └── test-db/route.ts      # Database connection test
├── components/ui/                # shadcn/ui components
└── lib/
    ├── printful.ts               # Printful API client
    └── utils.ts                  # Utility functions
```

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## How It Works

1. User enters a text description of their desired design
2. Google Gemini enhances the prompt for better image generation
3. FLUX.1 (via HuggingFace) generates the artwork
4. User selects a product type from the Printful catalog
5. The design is applied to the product and an order is created via Printful

## License

[MIT](LICENSE)
