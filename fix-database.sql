-- ============================================
-- CORRECTIF: Ajouter is_president et corriger les données
-- ============================================

-- 1. Ajouter la colonne is_president si elle n'existe pas
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_president BOOLEAN DEFAULT FALSE;

-- 2. Ajouter la colonne president_year si elle n'existe pas
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS president_year TEXT;

-- 3. Ajouter la colonne president_achievements si elle n'existe pas
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS president_achievements TEXT;

-- 4. Ajouter la colonne president_color si elle n'existe pas
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS president_color TEXT DEFAULT 'from-blue-500 to-purple-500';

-- 5. Mettre à jour tous les utilisateurs existants pour avoir is_president = false par défaut
UPDATE public.users 
SET is_president = FALSE 
WHERE is_president IS NULL;

-- 6. Afficher les utilisateurs actuels
SELECT id, prenom, nom, grade, is_president FROM public.users;

-- ============================================
-- INSTRUCTIONS POUR L'UTILISATEUR
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Colonnes ajoutées avec succès!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Prochaines étapes:';
  RAISE NOTICE '1. Vérifiez les utilisateurs ci-dessus';
  RAISE NOTICE '2. Si vous voulez marquer quelqu''un comme président, exécutez:';
  RAISE NOTICE '   UPDATE public.users SET is_president = TRUE, president_year = ''2024-2025'', president_achievements = ''Vos réalisations'' WHERE email = ''email@example.com'';';
  RAISE NOTICE '';
  RAISE NOTICE '3. Pour les grades, vous pouvez les garder tels quels (Kappa, Gamma, etc.)';
  RAISE NOTICE '   OU les changer vers les grades standards:';
  RAISE NOTICE '   UPDATE public.users SET grade = ''Membre'' WHERE grade = ''Kappa'';';
  RAISE NOTICE '   UPDATE public.users SET grade = ''Adjoint'' WHERE grade = ''Gamma'';';
  RAISE NOTICE '   UPDATE public.users SET grade = ''Responsable'' WHERE grade = ''Haut communicant'';';
END $$;
