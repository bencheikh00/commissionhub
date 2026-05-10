-- ============================================
-- CORRECTIF: Marquer le président + Corriger RLS
-- ============================================

-- 1. Désactiver temporairement RLS pour la mise à jour
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Marquer ablaye Gueye comme président
UPDATE public.users 
SET 
  is_president = TRUE,
  president_year = '2024-2025',
  president_achievements = 'Digitalisation de la commission, création de la plateforme CommissionHub',
  president_color = 'from-orange-500 to-red-500'
WHERE prenom ILIKE '%ablaye%' AND nom ILIKE '%Gueye%';

-- 3. Réactiver RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Vérifier le résultat
SELECT 
  prenom, 
  nom, 
  grade, 
  is_president, 
  president_year 
FROM public.users 
WHERE is_president = TRUE;

-- 5. Message de confirmation
DO $$
DECLARE
  president_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO president_count FROM public.users WHERE is_president = TRUE;
  
  IF president_count > 0 THEN
    RAISE NOTICE '✅ Président(s) marqué(s) avec succès: %', president_count;
  ELSE
    RAISE NOTICE '❌ Aucun président trouvé. Vérifiez le nom dans la requête UPDATE.';
  END IF;
END $$;
