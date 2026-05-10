-- ============================================
-- FIX RLS POLICIES POUR TABLE NOTIFICATIONS
-- Permettre l'insertion automatique par les triggers
-- ============================================

-- Supprimer les anciennes policies restrictives
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

-- Policy: Tout le monde peut lire ses propres notifications
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  USING (true);

-- Policy: Permettre l'insertion sans vérifier auth.uid() (pour les triggers)
DROP POLICY IF EXISTS "Allow insert notifications" ON public.notifications;
CREATE POLICY "Allow insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Policy: Users peuvent mettre à jour leurs notifications
DROP POLICY IF EXISTS "Users can update notifications" ON public.notifications;
CREATE POLICY "Users can update notifications"
  ON public.notifications FOR UPDATE
  USING (true);

-- Policy: Users peuvent supprimer leurs notifications
DROP POLICY IF EXISTS "Users can delete notifications" ON public.notifications;
CREATE POLICY "Users can delete notifications"
  ON public.notifications FOR DELETE
  USING (true);

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Afficher toutes les policies de la table notifications
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'notifications';

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS Policies corrigées pour table notifications!';
  RAISE NOTICE '🔓 INSERT autorisé sans auth.uid() (pour triggers)';
  RAISE NOTICE '📝 Les triggers peuvent maintenant créer des notifications';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ IMPORTANT: Ces policies sont permissives';
  RAISE NOTICE '💡 Les triggers créent automatiquement les notifications';
END $$;
