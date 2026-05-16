-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Designs table (stores generated artwork)
CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  prompt TEXT NOT NULL,
  enhanced_prompt TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'generating', -- 'generating', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table (links designs to Printful items)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES designs NOT NULL,
  printful_product_id TEXT,
  printful_variant_id TEXT,
  title TEXT,
  description TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table (tracks customer purchases)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id UUID REFERENCES products NOT NULL,
  printful_order_id TEXT,
  status TEXT DEFAULT 'pending',
  total_price DECIMAL(10,2),
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
