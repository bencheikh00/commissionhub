-- ============================================
-- MIGRATION COMPLÈTE: Ajouter toutes les colonnes manquantes
-- Exécuter AVANT supabase-schema-complete.sql
-- ============================================

-- Ajouter toutes les colonnes manquantes à la table users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_president BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS president_year TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS president_achievements TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS president_color TEXT DEFAULT 'from-blue-500 to-purple-500';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'offline';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Ajouter contrainte sur status si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_status_check'
  ) THEN
    ALTER TABLE public.users ADD CONSTRAINT users_status_check 
    CHECK (status IN ('online', 'away', 'offline'));
  END IF;
END $$;

-- Mettre à jour les avatars existants avec les initiales
UPDATE public.users 
SET avatar = UPPER(LEFT(prenom, 1) || LEFT(nom, 1))
WHERE avatar IS NULL;

-- Rendre la colonne avatar NOT NULL après avoir rempli les valeurs
ALTER TABLE public.users ALTER COLUMN avatar SET NOT NULL;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Migration complète terminée';
  RAISE NOTICE '📊 Colonnes ajoutées: avatar, photo_url, is_president, president_year,';
  RAISE NOTICE '   president_achievements, president_color, phone, bio, status, last_seen';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Vous pouvez maintenant exécuter supabase-schema-complete.sql';
END $$;
