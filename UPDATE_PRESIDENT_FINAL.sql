-- ============================================
-- SOLUTION FINALE: Marquer ablaye Gueye comme président
-- Copiez et collez ce code dans Supabase SQL Editor
-- ============================================

-- Mettre à jour ablaye Gueye comme président
UPDATE public.users 
SET 
  is_president = TRUE,
  president_year = '2024-2025',
  president_achievements = 'Digitalisation de la commission, création de la plateforme CommissionHub',
  president_color = 'from-orange-500 to-red-500'
WHERE id = 'e7980697-deb1-46ff-ad56-44c11c3607c8';

-- Vérifier le résultat
SELECT 
  prenom, 
  nom, 
  grade,
  is_president, 
  president_year,
  president_achievements
FROM public.users 
WHERE id = 'e7980697-deb1-46ff-ad56-44c11c3607c8';
