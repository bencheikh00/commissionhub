-- ============================================
-- SUPPRIMER LE TRIGGER DE NOTIFICATIONS AUTOMATIQUES
-- Car l'application n'utilise pas Supabase Auth
-- ============================================

-- Supprimer le trigger qui crée automatiquement les notifications
DROP TRIGGER IF EXISTS trigger_notify_new_meeting ON public.meetings;

-- Supprimer la fonction associée
DROP FUNCTION IF EXISTS notify_new_meeting();

-- Désactiver RLS sur notifications pour éviter tout problème
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- Vérification
SELECT 
  trigger_name, 
  event_object_table, 
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'meetings';

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Trigger de notifications supprimé!';
  RAISE NOTICE '🔓 RLS désactivé sur table notifications';
  RAISE NOTICE '📝 Les réunions peuvent maintenant être créées sans problème';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Les notifications seront gérées côté application si nécessaire';
END $$;
