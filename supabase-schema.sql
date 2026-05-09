-- Commission Hub Database Schema
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (membres de la commission)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('Alpha', 'Gamma', 'Kappa', 'Delta', 'Oméga', 'Haut communicant', 'Très haut communicant', 'Plus')),
  photo_url TEXT NOT NULL,
  was_president BOOLEAN DEFAULT FALSE,
  president_year TEXT,
  phone TEXT,
  join_date TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Presidents table (anciens présidents)
CREATE TABLE IF NOT EXISTS presidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  year TEXT NOT NULL,
  avatar TEXT NOT NULL,
  achievements TEXT,
  color TEXT DEFAULT 'from-blue-400 to-cyan-400',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages table (chat)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Absences table (demandes d'absence)
CREATE TABLE IF NOT EXISTS absences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_absences_user_id ON absences(user_id);
CREATE INDEX IF NOT EXISTS idx_presidents_year ON presidents(year);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE presidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow authenticated users to read all data)
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can view all presidents" ON presidents FOR SELECT USING (true);
CREATE POLICY "Users can view all messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Users can view all absences" ON absences FOR SELECT USING (true);

-- Users can insert their own data
CREATE POLICY "Users can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can insert absences" ON absences FOR INSERT WITH CHECK (true);

-- Insert sample data for presidents
INSERT INTO presidents (name, year, avatar, achievements, color) VALUES
  ('Mariam Diop', '2023-2024', 'MD', 'Digitalisation complète, +40% de membres', 'from-yellow-400 to-orange-400'),
  ('Ibrahima Sarr', '2021-2022', 'IS', 'Nouveau système de communication, 15 événements', 'from-blue-400 to-cyan-400'),
  ('Amadou Diallo', '2019-2020', 'AD', 'Refonte de la charte, partenariats stratégiques', 'from-purple-400 to-pink-400'),
  ('Fatou Sow', '2017-2018', 'FS', 'Création du hub digital, formation des membres', 'from-green-400 to-emerald-400'),
  ('Moussa Kane', '2015-2016', 'MK', 'Expansion régionale, 20+ projets réalisés', 'from-red-400 to-rose-400')
ON CONFLICT DO NOTHING;
