-- DocsGenius Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Sections (template groups) table
CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  subcategory_id TEXT NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Sentences table
CREATE TABLE IF NOT EXISTS sentences (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Sentence parts table (for dynamic sentence structure)
CREATE TABLE IF NOT EXISTS sentence_parts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sentence_id TEXT NOT NULL REFERENCES sentences(id) ON DELETE CASCADE,
  part_order INTEGER NOT NULL,
  part_type TEXT NOT NULL CHECK (part_type IN ('text', 'input', 'select')),
  part_value TEXT,
  part_label TEXT,
  part_width TEXT,
  part_input_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_display_order ON subcategories(display_order);
CREATE INDEX IF NOT EXISTS idx_sections_subcategory_id ON sections(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_sections_display_order ON sections(display_order);
CREATE INDEX IF NOT EXISTS idx_sentences_section_id ON sentences(section_id);
CREATE INDEX IF NOT EXISTS idx_sentences_display_order ON sentences(display_order);
CREATE INDEX IF NOT EXISTS idx_sentence_parts_sentence_id ON sentence_parts(sentence_id);
CREATE INDEX IF NOT EXISTS idx_sentence_parts_order ON sentence_parts(sentence_id, part_order);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentence_parts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Subcategories policies (cascade from categories)
CREATE POLICY "Users can view subcategories of their categories" ON subcategories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM categories 
      WHERE categories.id = subcategories.category_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert subcategories to their categories" ON subcategories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM categories 
      WHERE categories.id = subcategories.category_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update subcategories of their categories" ON subcategories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM categories 
      WHERE categories.id = subcategories.category_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete subcategories of their categories" ON subcategories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM categories 
      WHERE categories.id = subcategories.category_id 
      AND categories.user_id = auth.uid()
    )
  );

-- Sections policies (cascade from subcategories)
CREATE POLICY "Users can view sections of their subcategories" ON sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM subcategories
      JOIN categories ON categories.id = subcategories.category_id
      WHERE subcategories.id = sections.subcategory_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert sections to their subcategories" ON sections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM subcategories
      JOIN categories ON categories.id = subcategories.category_id
      WHERE subcategories.id = sections.subcategory_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sections of their subcategories" ON sections
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM subcategories
      JOIN categories ON categories.id = subcategories.category_id
      WHERE subcategories.id = sections.subcategory_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sections of their subcategories" ON sections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM subcategories
      JOIN categories ON categories.id = subcategories.category_id
      WHERE subcategories.id = sections.subcategory_id 
      AND categories.user_id = auth.uid()
    )
  );

-- Sentences policies (cascade from sections)
CREATE POLICY "Users can view sentences of their sections" ON sentences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sections
      JOIN subcategories ON subcategories.id = sections.subcategory_id
      JOIN categories ON categories.id = subcategories.category_id
      WHERE sections.id = sentences.section_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert sentences to their sections" ON sentences
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sections
      JOIN subcategories ON subcategories.id = sections.subcategory_id
      JOIN categories ON categories.id = subcategories.category_id
      WHERE sections.id = sentences.section_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sentences of their sections" ON sentences
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM sections
      JOIN subcategories ON subcategories.id = sections.subcategory_id
      JOIN categories ON categories.id = subcategories.category_id
      WHERE sections.id = sentences.section_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sentences of their sections" ON sentences
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM sections
      JOIN subcategories ON subcategories.id = sections.subcategory_id
      JOIN categories ON categories.id = subcategories.category_id
      WHERE sections.id = sentences.section_id 
      AND categories.user_id = auth.uid()
    )
  );

-- Sentence parts policies (cascade from sentences)
CREATE POLICY "Users can view parts of their sentences" ON sentence_parts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sentences
      JOIN sections ON sections.id = sentences.section_id
      JOIN subcategories ON subcategories.id = sections.subcategory_id
      JOIN categories ON categories.id = subcategories.category_id
      WHERE sentences.id = sentence_parts.sentence_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert parts to their sentences" ON sentence_parts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sentences
      JOIN sections ON sections.id = sentences.section_id
      JOIN subcategories ON subcategories.id = sections.subcategory_id
      JOIN categories ON categories.id = subcategories.category_id
      WHERE sentences.id = sentence_parts.sentence_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update parts of their sentences" ON sentence_parts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM sentences
      JOIN sections ON sections.id = sentences.section_id
      JOIN subcategories ON subcategories.id = sections.subcategory_id
      JOIN categories ON categories.id = subcategories.category_id
      WHERE sentences.id = sentence_parts.sentence_id 
      AND categories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete parts of their sentences" ON sentence_parts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM sentences
      JOIN sections ON sections.id = sentences.section_id
      JOIN subcategories ON subcategories.id = sections.subcategory_id
      JOIN categories ON categories.id = subcategories.category_id
      WHERE sentences.id = sentence_parts.sentence_id 
      AND categories.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON subcategories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sentences_updated_at BEFORE UPDATE ON sentences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sentence_parts_updated_at BEFORE UPDATE ON sentence_parts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

