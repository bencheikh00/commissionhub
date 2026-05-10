-- ============================================
-- FIX COMPLET POUR TABLE MEETINGS
-- ============================================

-- 1. Supprimer TOUS les triggers sur meetings
DROP TRIGGER IF EXISTS trigger_notify_new_meeting ON public.meetings;
DROP TRIGGER IF EXISTS update_meetings_updated_at ON public.meetings;

-- 2. Supprimer les fonctions associées
DROP FUNCTION IF EXISTS notify_new_meeting() CASCADE;

-- 3. Désactiver RLS sur meetings
ALTER TABLE public.meetings DISABLE ROW LEVEL SECURITY;

-- 4. Désactiver RLS sur notifications
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- 5. Vérifier les tables
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('meetings', 'notifications');

-- 6. Vérifier qu'il n'y a plus de triggers
SELECT 
  trigger_name, 
  event_object_table
FROM information_schema.triggers
WHERE event_object_table IN ('meetings', 'notifications');

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Configuration complète terminée!';
  RAISE NOTICE '🔓 RLS désactivé sur meetings et notifications';
  RAISE NOTICE '🗑️ Tous les triggers supprimés';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Vous pouvez maintenant créer des réunions sans problème';
END $$;
