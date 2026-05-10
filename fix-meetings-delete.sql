-- Désactiver RLS sur la table meetings pour permettre toutes les opérations
ALTER TABLE meetings DISABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est bien désactivé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'meetings';
