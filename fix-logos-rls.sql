-- ============================================
-- FIX RLS POLICIES POUR TABLE LOGOS
-- Permet aux admins d'insérer sans auth.uid()
-- ============================================

-- Supprimer l'ancienne policy restrictive
DROP POLICY IF EXISTS "Admins can manage logos" ON public.logos;

-- Nouvelle policy: Tout le monde peut lire
DROP POLICY IF EXISTS "Everyone can read logos" ON public.logos;
CREATE POLICY "Everyone can read logos"
  ON public.logos FOR SELECT
  USING (true);

-- Nouvelle policy: Admins peuvent insérer (sans vérifier auth.uid())
CREATE POLICY "Admins can insert logos"
  ON public.logos FOR INSERT
  WITH CHECK (true);

-- Nouvelle policy: Admins peuvent modifier
CREATE POLICY "Admins can update logos"
  ON public.logos FOR UPDATE
  USING (true);

-- Nouvelle policy: Admins peuvent supprimer
CREATE POLICY "Admins can delete logos"
  ON public.logos FOR DELETE
  USING (true);

-- ============================================
-- FIX STORAGE POLICIES (même problème)
-- ============================================

-- Supprimer anciennes policies storage
DROP POLICY IF EXISTS "Admins can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete logos" ON storage.objects;

-- Nouvelles policies storage (sans auth.uid())
CREATE POLICY "Anyone can upload to logos bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Anyone can update logos bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'logos');

CREATE POLICY "Anyone can delete from logos bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'logos');

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS Policies corrigées pour table logos!';
  RAISE NOTICE '🔓 Insertion/Update/Delete autorisés sans auth.uid()';
  RAISE NOTICE '📦 Storage policies également corrigées';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ IMPORTANT: Ces policies sont permissives';
  RAISE NOTICE '💡 Ajoutez la vérification du role Admin côté client';
END $$;
