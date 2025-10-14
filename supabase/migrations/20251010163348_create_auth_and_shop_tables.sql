/*
  # Create Authentication and Shop System

  ## Tables Created
  
  1. **products**
     - `id` (uuid, primary key) - Unique product identifier
     - `inventory_id` (text, unique) - Human-readable inventory ID (e.g., "PROD-001")
     - `title` (text) - Product name
     - `description` (text) - Product description
     - `price` (numeric) - Product price
     - `category` (text) - Product category
     - `icon_name` (text) - Icon identifier
     - `stock_quantity` (integer) - Available stock
     - `features` (jsonb) - Array of product features
     - `created_at` (timestamptz) - Creation timestamp
     - `updated_at` (timestamptz) - Last update timestamp

  2. **coupon_codes**
     - `id` (uuid, primary key) - Unique coupon identifier
     - `code` (text, unique) - Coupon code (e.g., "Fall2025")
     - `discount_type` (text) - Type: 'percentage' or 'fixed'
     - `discount_value` (numeric) - Discount amount
     - `valid_from` (timestamptz) - Start date
     - `valid_until` (timestamptz) - End date
     - `max_uses` (integer) - Maximum number of uses
     - `current_uses` (integer) - Current use count
     - `active` (boolean) - Whether coupon is active
     - `created_at` (timestamptz) - Creation timestamp

  3. **orders**
     - `id` (uuid, primary key) - Unique order identifier
     - `user_id` (uuid) - User who placed order (references auth.users)
     - `order_number` (text, unique) - Human-readable order number
     - `email` (text) - Customer email
     - `total_amount` (numeric) - Order total
     - `coupon_code` (text) - Applied coupon code
     - `discount_amount` (numeric) - Discount applied
     - `status` (text) - Order status
     - `created_at` (timestamptz) - Order creation time

  4. **order_items**
     - `id` (uuid, primary key) - Unique item identifier
     - `order_id` (uuid) - Order reference
     - `product_id` (uuid) - Product reference
     - `quantity` (integer) - Quantity ordered
     - `price` (numeric) - Price at time of purchase
     - `created_at` (timestamptz) - Creation timestamp

  5. **user_profiles**
     - `id` (uuid, primary key) - References auth.users
     - `email` (text) - User email
     - `full_name` (text) - User's full name
     - `created_at` (timestamptz) - Profile creation time
     - `updated_at` (timestamptz) - Last update time

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Public read access for products and active coupons
  - Strict policies for orders and user profiles

  ## Notes
  - Initial products will be seeded with inventory IDs
  - Fall2025 coupon code will be created with 20% discount
  - Stock quantities set for all products
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL,
  category text NOT NULL,
  icon_name text NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create coupon codes table
CREATE TABLE IF NOT EXISTS coupon_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric(10, 2) NOT NULL,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  max_uses integer,
  current_uses integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  order_number text UNIQUE NOT NULL,
  email text NOT NULL,
  total_amount numeric(10, 2) NOT NULL,
  coupon_code text,
  discount_amount numeric(10, 2) DEFAULT 0,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  price numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Products policies (public read)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

-- Coupon codes policies (public read active coupons)
CREATE POLICY "Anyone can view active coupons"
  ON coupon_codes FOR SELECT
  TO public
  USING (active = true);

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- User profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Insert products with inventory IDs and stock
INSERT INTO products (inventory_id, title, description, price, category, icon_name, stock_quantity, features) VALUES
  ('GDF-001', 'Game Design Fundamentals Flipbook', 'Interactive digital flipbook covering core game design principles, mechanics, and player psychology.', 29.99, 'Digital Flipbooks', 'Book', 150, '["150+ pages", "Interactive elements", "Video examples", "Downloadable resources"]'::jsonb),
  ('CDF-001', 'Character Design Masterclass Flipbook', 'Complete guide to creating memorable game characters with step-by-step tutorials.', 34.99, 'Digital Flipbooks', 'Palette', 120, '["200+ pages", "Character templates", "Art techniques", "Industry insights"]'::jsonb),
  ('UNI-001', 'Unity Game Development Course', 'Complete Unity course from beginner to advanced, build 5 complete games.', 89.99, 'Video Tutorials', 'Play', 75, '["40+ hours video", "5 complete projects", "Source code included", "Lifetime access"]'::jsonb),
  ('UNR-001', 'Unreal Engine 5 Masterclass', 'Master UE5 with hands-on projects including Lumen, Nanite, and Blueprint scripting.', 99.99, 'Video Tutorials', 'Gamepad2', 60, '["50+ hours video", "UE5 latest features", "Blueprint & C++", "Portfolio projects"]'::jsonb),
  ('CGP-001', 'GameDev Code Generator Pro', 'AI-powered code generation tool for common game development patterns and systems.', 149.99, 'Programming Software', 'Code', 45, '["AI code generation", "Multiple languages", "Pattern library", "1-year updates"]'::jsonb),
  ('LDT-001', 'Level Design Toolkit', 'Professional level design software with procedural generation and testing tools.', 199.99, 'Programming Software', 'Shield', 30, '["Procedural generation", "Playtesting tools", "Export to engines", "Team collaboration"]'::jsonb)
ON CONFLICT (inventory_id) DO NOTHING;

-- Insert Fall2025 coupon code (20% off, valid until end of 2025)
INSERT INTO coupon_codes (code, discount_type, discount_value, valid_until, max_uses, active) VALUES
  ('Fall2025', 'percentage', 20, '2025-12-31 23:59:59+00', 1000, true)
ON CONFLICT (code) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_products_updated_at') THEN
    CREATE TRIGGER update_products_updated_at
      BEFORE UPDATE ON products
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at') THEN
    CREATE TRIGGER update_user_profiles_updated_at
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
