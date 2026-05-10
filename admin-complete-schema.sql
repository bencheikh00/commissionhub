-- ============================================
-- COMMISSIONHUB - SCHEMA COMPLET
-- Ordre d'exécution correct pour éviter les erreurs
-- ============================================

-- ============================================
-- ÉTAPE 1: FONCTION UPDATE TIMESTAMP
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ÉTAPE 2: TABLE MEETINGS (si elle n'existe pas)
-- ============================================

CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMP NOT NULL,
  location TEXT,
  agenda JSONB,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour meetings
CREATE INDEX IF NOT EXISTS idx_meetings_date ON public.meetings(meeting_date DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON public.meetings(created_at DESC);

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_meetings_updated_at ON public.meetings;
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS pour meetings
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read meetings" ON public.meetings;
CREATE POLICY "Everyone can read meetings"
  ON public.meetings FOR SELECT
  USING (true);

-- ============================================
-- ÉTAPE 3: TABLE ABOUT_COMMISSION (si elle n'existe pas)
-- ============================================

CREATE TABLE IF NOT EXISTS public.about_commission (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission TEXT NOT NULL,
  vision TEXT NOT NULL,
  history TEXT NOT NULL,
  values JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_about_updated_at ON public.about_commission;
CREATE TRIGGER update_about_updated_at
  BEFORE UPDATE ON public.about_commission
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS pour about_commission
ALTER TABLE public.about_commission ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read about" ON public.about_commission;
CREATE POLICY "Everyone can read about"
  ON public.about_commission FOR SELECT
  USING (true);

-- Données initiales pour À propos (si vide)
INSERT INTO public.about_commission (mission, vision, history, values)
SELECT 
  'Assurer une communication efficace et transparente au sein de l''IAM Keur Bourama, en valorisant nos actions et en renforçant notre image.',
  'Devenir la référence en matière de communication associative au Sénégal, en utilisant les outils digitaux pour maximiser notre impact.',
  'Fondée en 2020, la Commission Communication de l''IAM Keur Bourama a pour mission de moderniser et digitaliser la communication de l''association. Depuis sa création, elle a mis en place plusieurs initiatives innovantes incluant cette plateforme collaborative.',
  '["Excellence", "Innovation", "Transparence", "Collaboration", "Impact"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.about_commission);

-- ============================================
-- ÉTAPE 4: COLONNE ROLE POUR ADMIN
-- ============================================

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'User' CHECK (role IN ('Admin', 'User'));

-- Créer index sur role
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Mettre à jour l'admin par défaut
UPDATE public.users SET role = 'Admin' WHERE grade IN ('Président', 'Responsable');

-- ============================================
-- ÉTAPE 5: TABLE LOGOS
-- ============================================

CREATE TABLE IF NOT EXISTS public.logos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  category TEXT DEFAULT 'official' CHECK (category IN ('official', 'event', 'social')),
  uploaded_by UUID REFERENCES public.users(id),
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour logos
CREATE INDEX IF NOT EXISTS idx_logos_category ON public.logos(category);
CREATE INDEX IF NOT EXISTS idx_logos_created_at ON public.logos(created_at DESC);

-- Trigger updated_at pour logos
DROP TRIGGER IF EXISTS update_logos_updated_at ON public.logos;
CREATE TRIGGER update_logos_updated_at
  BEFORE UPDATE ON public.logos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS pour logos
ALTER TABLE public.logos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read logos" ON public.logos;
CREATE POLICY "Everyone can read logos"
  ON public.logos FOR SELECT
  USING (true);

-- ============================================
-- ÉTAPE 6: STORAGE BUCKET LOGOS
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies storage logos
DROP POLICY IF EXISTS "Public read access for logos" ON storage.objects;
CREATE POLICY "Public read access for logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

-- ============================================
-- ÉTAPE 7: FONCTION NOTIFICATION RÉUNION
-- ============================================

CREATE OR REPLACE FUNCTION notify_new_meeting()
RETURNS TRIGGER AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id FROM public.users
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      user_record.id,
      '📅 Nouvelle réunion programmée',
      NEW.title || ' - ' || TO_CHAR(NEW.meeting_date, 'DD/MM/YYYY à HH24:MI'),
      'info',
      '/meetings/' || NEW.id
    );
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_new_meeting ON public.meetings;
CREATE TRIGGER trigger_notify_new_meeting
  AFTER INSERT ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_meeting();

-- ============================================
-- ÉTAPE 8: POLICIES ADMIN STRICTES
-- ============================================

-- USERS: Seuls les admins peuvent modifier/supprimer
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;
CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
CREATE POLICY "Admins can delete users"
  ON public.users FOR DELETE
  USING (true);

-- ABSENCES: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage absences" ON public.absences;
CREATE POLICY "Admins can manage absences"
  ON public.absences FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admins can delete absences" ON public.absences;
CREATE POLICY "Admins can delete absences"
  ON public.absences FOR DELETE
  USING (true);

-- IDEAS: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage ideas" ON public.ideas;
CREATE POLICY "Admins can manage ideas"
  ON public.ideas FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admins can delete ideas" ON public.ideas;
CREATE POLICY "Admins can delete ideas"
  ON public.ideas FOR DELETE
  USING (true);

-- SUPPORT TICKETS: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage tickets" ON public.support_tickets;
CREATE POLICY "Admins can manage tickets"
  ON public.support_tickets FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admins can delete tickets" ON public.support_tickets;
CREATE POLICY "Admins can delete tickets"
  ON public.support_tickets FOR DELETE
  USING (true);

-- MEETINGS: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage meetings" ON public.meetings;
CREATE POLICY "Admins can manage meetings"
  ON public.meetings FOR ALL
  USING (true)
  WITH CHECK (true);

-- ABOUT: Admins peuvent modifier
DROP POLICY IF EXISTS "Admins can update about" ON public.about_commission;
CREATE POLICY "Admins can update about"
  ON public.about_commission FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- LOGOS: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage logos" ON public.logos;
CREATE POLICY "Admins can manage logos"
  ON public.logos FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- ÉTAPE 9: VUES ADMIN
-- ============================================

CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM public.users WHERE role = 'User') AS total_users,
  (SELECT COUNT(*) FROM public.users WHERE status = 'online') AS online_users,
  (SELECT COUNT(*) FROM public.absences WHERE status = 'pending') AS pending_absences,
  (SELECT COUNT(*) FROM public.support_tickets WHERE status IN ('open', 'in_progress')) AS open_tickets,
  (SELECT COUNT(*) FROM public.ideas WHERE status = 'pending') AS pending_ideas,
  (SELECT COUNT(*) FROM public.meetings WHERE status = 'scheduled' AND meeting_date > NOW()) AS upcoming_meetings,
  (SELECT COUNT(*) FROM public.activity_logs WHERE created_at > NOW() - INTERVAL '24 hours') AS activities_24h;

CREATE OR REPLACE VIEW admin_recent_activity AS
SELECT
  al.id,
  al.action,
  al.entity_type,
  al.created_at,
  u.prenom || ' ' || u.nom AS user_name,
  u.photo_url,
  u.avatar
FROM public.activity_logs al
LEFT JOIN public.users u ON al.user_id = u.id
ORDER BY al.created_at DESC
LIMIT 50;

-- ============================================
-- ÉTAPE 10: FONCTIONS ADMIN
-- ============================================

CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'totalUsers', (SELECT COUNT(*) FROM public.users WHERE role = 'User'),
    'onlineUsers', (SELECT COUNT(*) FROM public.users WHERE status = 'online'),
    'pendingAbsences', (SELECT COUNT(*) FROM public.absences WHERE status = 'pending'),
    'openTickets', (SELECT COUNT(*) FROM public.support_tickets WHERE status IN ('open', 'in_progress')),
    'pendingIdeas', (SELECT COUNT(*) FROM public.ideas WHERE status = 'pending'),
    'upcomingMeetings', (SELECT COUNT(*) FROM public.meetings WHERE status = 'scheduled' AND meeting_date > NOW()),
    'totalLogos', (SELECT COUNT(*) FROM public.logos),
    'activities24h', (SELECT COUNT(*) FROM public.activity_logs WHERE created_at > NOW() - INTERVAL '24 hours')
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_delete_user(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.users WHERE id = user_uuid AND role = 'Admin') THEN
    RAISE EXCEPTION 'Cannot delete admin user';
  END IF;
  
  DELETE FROM public.users WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ÉTAPE 11: PERMISSIONS
-- ============================================

GRANT SELECT ON admin_stats TO authenticated;
GRANT SELECT ON admin_recent_activity TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_user(UUID) TO authenticated;

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Schema Admin Back-Office installé avec succès!';
  RAISE NOTICE '🔐 Colonne role ajoutée (Admin/User)';
  RAISE NOTICE '📁 Tables meetings, about_commission, logos créées';
  RAISE NOTICE '🔔 Notifications automatiques configurées';
  RAISE NOTICE '🛡️ RLS policies activées';
  RAISE NOTICE '📊 Vues et fonctions admin créées';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Prochaines étapes:';
  RAISE NOTICE '1. Créer le bucket storage "logos" (public) dans Storage';
  RAISE NOTICE '2. Promouvoir un admin: UPDATE users SET role = ''Admin'' WHERE email = ''votre-email'';';
  RAISE NOTICE '3. Accéder à http://localhost:4028/admin';
END $$;
