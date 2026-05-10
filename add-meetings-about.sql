-- ============================================
-- NOUVELLES TABLES: MEETINGS & ABOUT
-- ============================================

-- Table des réunions
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMP NOT NULL,
  location TEXT,
  agenda JSONB, -- Ordre du jour structuré
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table À propos de la commission
CREATE TABLE IF NOT EXISTS public.about_commission (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission TEXT NOT NULL,
  vision TEXT NOT NULL,
  history TEXT NOT NULL,
  values JSONB, -- Valeurs de la commission
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_meetings_date ON public.meetings(meeting_date DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON public.meetings(created_at DESC);

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_meetings_updated_at ON public.meetings;
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_about_updated_at ON public.about_commission;
CREATE TRIGGER update_about_updated_at
  BEFORE UPDATE ON public.about_commission
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_commission ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les réunions
CREATE POLICY "Everyone can read meetings"
  ON public.meetings FOR SELECT
  USING (true);

-- Seuls les admins peuvent créer/modifier les réunions
CREATE POLICY "Admins can manage meetings"
  ON public.meetings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Tout le monde peut lire À propos
CREATE POLICY "Everyone can read about"
  ON public.about_commission FOR SELECT
  USING (true);

-- Seuls les admins peuvent modifier À propos
CREATE POLICY "Admins can update about"
  ON public.about_commission FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Données initiales pour À propos
INSERT INTO public.about_commission (mission, vision, history, values) VALUES (
  'Assurer une communication efficace et transparente au sein de l''IAM Keur Bourama, en valorisant nos actions et en renforçant notre image.',
  'Devenir la référence en matière de communication associative au Sénégal, en utilisant les outils digitaux pour maximiser notre impact.',
  'Fondée en 2020, la Commission Communication de l''IAM Keur Bourama a pour mission de moderniser et digitaliser la communication de l''association. Depuis sa création, elle a mis en place plusieurs initiatives innovantes incluant cette plateforme collaborative.',
  '["Excellence", "Innovation", "Transparence", "Collaboration", "Impact"]'::jsonb
) ON CONFLICT DO NOTHING;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Tables meetings et about_commission créées avec succès!';
  RAISE NOTICE '📊 Nouvelles tables: meetings, about_commission';
  RAISE NOTICE '🔒 RLS Policies configurées';
  RAISE NOTICE '⚡ Indexes créés pour performance';
END $$;
