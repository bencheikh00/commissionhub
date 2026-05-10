-- ============================================
-- AJOUTER COLONNES MANQUANTES À TABLE ABSENCES
-- ============================================

-- Ajouter colonne reviewed_by (qui a approuvé/rejeté)
ALTER TABLE public.absences 
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.users(id);

-- Ajouter colonne reviewed_at (date de révision)
ALTER TABLE public.absences 
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;

-- Créer index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_absences_reviewed_by ON public.absences(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_absences_status ON public.absences(status);

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Colonnes reviewed_by et reviewed_at ajoutées à la table absences';
  RAISE NOTICE '📊 Index créés pour optimiser les performances';
END $$;
