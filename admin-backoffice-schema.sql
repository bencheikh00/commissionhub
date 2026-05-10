-- ============================================
-- ADMIN BACK-OFFICE SCHEMA
-- Interface Administrateur avec RLS strict
-- ============================================

-- Ajouter colonne role aux users (Admin/User)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'User' CHECK (role IN ('Admin', 'User'));

-- Créer index sur role
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Mettre à jour l'admin par défaut
UPDATE public.users SET role = 'Admin' WHERE grade IN ('Président', 'Responsable');

-- ============================================
-- FONCTION UPDATE TIMESTAMP (si elle n'existe pas)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLE LOGOS (Gestion des médias)
-- ============================================

CREATE TABLE IF NOT EXISTS public.logos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- png, svg, jpg
  file_size INTEGER, -- en bytes
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

-- Tout le monde peut lire les logos
CREATE POLICY "Everyone can read logos"
  ON public.logos FOR SELECT
  USING (true);

-- Seuls les admins peuvent gérer les logos
CREATE POLICY "Admins can manage logos"
  ON public.logos FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ));

-- ============================================
-- STORAGE BUCKET POUR LOGOS
-- ============================================

-- Créer bucket logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies storage logos
CREATE POLICY "Public read access for logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Admins can upload logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'logos' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin')
  );

CREATE POLICY "Admins can update logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'logos' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin')
  );

CREATE POLICY "Admins can delete logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'logos' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin')
  );

-- ============================================
-- FONCTION NOTIFICATION NOUVELLE RÉUNION
-- ============================================

-- Notifier tous les utilisateurs lors d'une nouvelle réunion
CREATE OR REPLACE FUNCTION notify_new_meeting()
RETURNS TRIGGER AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Notifier tous les utilisateurs
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
-- POLICIES ADMIN STRICTES
-- ============================================

-- Supprimer les anciennes policies trop permissives
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own pending absences" ON public.absences;

-- USERS: Seuls les admins peuvent modifier/supprimer
CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ));

CREATE POLICY "Admins can delete users"
  ON public.users FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ));

-- ABSENCES: Admins peuvent tout gérer
CREATE POLICY "Admins can manage absences"
  ON public.absences FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ));

CREATE POLICY "Admins can delete absences"
  ON public.absences FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ));

-- IDEAS: Admins peuvent tout gérer
CREATE POLICY "Admins can manage ideas"
  ON public.ideas FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ));

CREATE POLICY "Admins can delete ideas"
  ON public.ideas FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ));

-- SUPPORT TICKETS: Admins peuvent tout gérer
CREATE POLICY "Admins can manage tickets"
  ON public.support_tickets FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ));

CREATE POLICY "Admins can delete tickets"
  ON public.support_tickets FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ));

-- MEETINGS: Admins peuvent tout gérer (déjà fait dans add-meetings-about.sql)

-- ============================================
-- VUES ADMIN POUR STATISTIQUES
-- ============================================

-- Vue statistiques globales
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM public.users WHERE role = 'User') AS total_users,
  (SELECT COUNT(*) FROM public.users WHERE status = 'online') AS online_users,
  (SELECT COUNT(*) FROM public.absences WHERE status = 'pending') AS pending_absences,
  (SELECT COUNT(*) FROM public.support_tickets WHERE status IN ('open', 'in_progress')) AS open_tickets,
  (SELECT COUNT(*) FROM public.ideas WHERE status = 'pending') AS pending_ideas,
  (SELECT COUNT(*) FROM public.meetings WHERE status = 'scheduled' AND meeting_date > NOW()) AS upcoming_meetings,
  (SELECT COUNT(*) FROM public.activity_logs WHERE created_at > NOW() - INTERVAL '24 hours') AS activities_24h;

-- Vue activité récente
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
-- FONCTIONS ADMIN
-- ============================================

-- Fonction pour obtenir les statistiques dashboard
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

-- Fonction pour supprimer un utilisateur (cascade)
CREATE OR REPLACE FUNCTION admin_delete_user(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Vérifier que l'utilisateur n'est pas admin
  IF EXISTS (SELECT 1 FROM public.users WHERE id = user_uuid AND role = 'Admin') THEN
    RAISE EXCEPTION 'Cannot delete admin user';
  END IF;
  
  -- Supprimer l'utilisateur (cascade automatique)
  DELETE FROM public.users WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GRANT PERMISSIONS
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
  RAISE NOTICE '✅ Admin Back-Office Schema créé avec succès!';
  RAISE NOTICE '🔐 Colonne role ajoutée (Admin/User)';
  RAISE NOTICE '📁 Table logos créée avec storage bucket';
  RAISE NOTICE '🔔 Notifications automatiques pour nouvelles réunions';
  RAISE NOTICE '🛡️ RLS policies strictes pour admins uniquement';
  RAISE NOTICE '📊 Vues et fonctions admin créées';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Prochaines étapes:';
  RAISE NOTICE '1. Exécuter ce script dans Supabase SQL Editor';
  RAISE NOTICE '2. Créer le bucket storage "logos" (public)';
  RAISE NOTICE '3. Développer l''interface admin React';
END $$;
