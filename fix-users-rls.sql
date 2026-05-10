-- Désactiver RLS sur la table users pour permettre les mises à jour
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- OU si vous voulez garder RLS mais permettre les updates admin
-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Créer des policies permissives
CREATE POLICY "Allow all operations on users"
ON users
FOR ALL
USING (true)
WITH CHECK (true);
