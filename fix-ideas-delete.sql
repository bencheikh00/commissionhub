-- Désactiver RLS sur la table ideas pour permettre toutes les opérations
ALTER TABLE ideas DISABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est bien désactivé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'ideas';
