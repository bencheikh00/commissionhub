-- ============================================
-- DÉSACTIVER RLS SUR TABLE NOTIFICATIONS
-- Solution simple et efficace
-- ============================================

-- Désactiver RLS complètement sur la table notifications
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- Vérifier le statut RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'notifications';

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS désactivé sur table notifications!';
  RAISE NOTICE '🔓 Toutes les opérations sont maintenant autorisées';
  RAISE NOTICE '📝 Les triggers peuvent créer des notifications sans restriction';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ IMPORTANT: RLS est désactivé pour cette table';
  RAISE NOTICE '💡 Ajoutez la vérification des permissions côté application';
END $$;
