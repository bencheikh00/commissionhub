-- ============================================
-- FIX: Supprimer contrainte NOT NULL sur photo_url
-- ============================================

-- Permettre les valeurs NULL pour photo_url (optionnel)
ALTER TABLE public.users ALTER COLUMN photo_url DROP NOT NULL;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Contrainte NOT NULL supprimée sur photo_url';
  RAISE NOTICE '📸 La colonne photo_url peut maintenant être NULL';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Vous pouvez maintenant exécuter supabase-schema-complete.sql';
END $$;
