-- Désactiver RLS sur la table support_tickets pour permettre toutes les opérations
ALTER TABLE support_tickets DISABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est bien désactivé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'support_tickets';
