-- ============================================
-- MIGRATION: Ajouter colonnes manquantes
-- Exécuter AVANT supabase-schema-complete.sql
-- ============================================

-- Ajouter colonne avatar si elle n'existe pas
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Mettre à jour les avatars existants avec les initiales
UPDATE public.users 
SET avatar = UPPER(LEFT(prenom, 1) || LEFT(nom, 1))
WHERE avatar IS NULL;

-- Rendre la colonne NOT NULL après avoir rempli les valeurs
ALTER TABLE public.users ALTER COLUMN avatar SET NOT NULL;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Migration terminée: colonne avatar ajoutée';
END $$;
