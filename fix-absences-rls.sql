-- ============================================
-- FIX RLS POLICIES POUR TABLE ABSENCES
-- Permettre aux admins de modifier les absences
-- ============================================

-- Supprimer les anciennes policies restrictives
DROP POLICY IF EXISTS "Admins can manage absences" ON public.absences;
DROP POLICY IF EXISTS "Admins can delete absences" ON public.absences;
DROP POLICY IF EXISTS "Users can update own pending absences" ON public.absences;

-- Policy: Tout le monde peut lire les absences
DROP POLICY IF EXISTS "Everyone can read absences" ON public.absences;
CREATE POLICY "Everyone can read absences"
  ON public.absences FOR SELECT
  USING (true);

-- Policy: Tout le monde peut créer des absences
DROP POLICY IF EXISTS "Users can create absences" ON public.absences;
CREATE POLICY "Users can create absences"
  ON public.absences FOR INSERT
  WITH CHECK (true);

-- Policy: Admins peuvent modifier toutes les absences (sans vérifier auth.uid())
DROP POLICY IF EXISTS "Admins can update absences" ON public.absences;
CREATE POLICY "Admins can update absences"
  ON public.absences FOR UPDATE
  USING (true);

-- Policy: Admins peuvent supprimer toutes les absences
DROP POLICY IF EXISTS "Admins can delete any absence" ON public.absences;
CREATE POLICY "Admins can delete any absence"
  ON public.absences FOR DELETE
  USING (true);

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Afficher toutes les policies de la table absences
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'absences';

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS Policies corrigées pour table absences!';
  RAISE NOTICE '🔓 UPDATE et DELETE autorisés sans auth.uid()';
  RAISE NOTICE '📝 Les admins peuvent maintenant modifier les absences';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ IMPORTANT: Ces policies sont permissives';
  RAISE NOTICE '💡 La vérification du role Admin se fait côté client';
END $$;
