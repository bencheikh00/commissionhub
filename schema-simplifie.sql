-- ============================================
-- COMMISSIONHUB - SCHEMA SIMPLIFIE
-- Sans table users (déjà existante)
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES (sans users)
-- ============================================

-- Absences table
CREATE TABLE IF NOT EXISTS public.absences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'implemented', 'rejected')),
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMP,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.users(id),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_absences_user_id ON public.absences(user_id);
CREATE INDEX IF NOT EXISTS idx_absences_status ON public.absences(status);
CREATE INDEX IF NOT EXISTS idx_absences_dates ON public.absences(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_absences_created_at ON public.absences(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON public.ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON public.ideas(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_priority ON public.support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_created_at ON public.support_tickets(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read) WHERE read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_absences_updated_at ON public.absences;
CREATE TRIGGER update_absences_updated_at
  BEFORE UPDATE ON public.absences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ideas_updated_at ON public.ideas;
CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_support_updated_at ON public.support_tickets;
CREATE TRIGGER update_support_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Notification triggers
CREATE OR REPLACE FUNCTION notify_new_absence()
RETURNS TRIGGER AS $$
DECLARE
  admin_id UUID;
BEGIN
  FOR admin_id IN 
    SELECT id FROM public.users 
    WHERE grade IN ('Responsable', 'Président')
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      admin_id,
      'Nouvelle demande d''absence',
      (SELECT prenom || ' ' || nom FROM public.users WHERE id = NEW.user_id) || ' a demandé une absence',
      'info',
      '/absences/' || NEW.id
    );
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_new_absence ON public.absences;
CREATE TRIGGER trigger_notify_new_absence
  AFTER INSERT ON public.absences
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_absence();

CREATE OR REPLACE FUNCTION notify_new_idea()
RETURNS TRIGGER AS $$
DECLARE
  admin_id UUID;
BEGIN
  FOR admin_id IN 
    SELECT id FROM public.users 
    WHERE grade IN ('Responsable', 'Président')
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      admin_id,
      'Nouvelle idée soumise',
      (SELECT prenom || ' ' || nom FROM public.users WHERE id = NEW.user_id) || ' a partagé une idée',
      'info',
      '/ideas/' || NEW.id
    );
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_new_idea ON public.ideas;
CREATE TRIGGER trigger_notify_new_idea
  AFTER INSERT ON public.ideas
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_idea();

CREATE OR REPLACE FUNCTION notify_new_support_ticket()
RETURNS TRIGGER AS $$
DECLARE
  admin_id UUID;
BEGIN
  FOR admin_id IN 
    SELECT id FROM public.users 
    WHERE grade IN ('Responsable', 'Président')
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      admin_id,
      'Nouveau problème signalé',
      (SELECT prenom || ' ' || nom FROM public.users WHERE id = NEW.user_id) || ' a signalé un problème',
      'warning',
      '/support/' || NEW.id
    );
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_new_support ON public.support_tickets;
CREATE TRIGGER trigger_notify_new_support
  AFTER INSERT ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_support_ticket();

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for users" ON public.users;
CREATE POLICY "Public read access for users"
  ON public.users FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read all absences" ON public.absences;
CREATE POLICY "Users can read all absences"
  ON public.absences FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own absences" ON public.absences;
CREATE POLICY "Users can insert own absences"
  ON public.absences FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own pending absences" ON public.absences;
CREATE POLICY "Users can update own pending absences"
  ON public.absences FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Users can read all ideas" ON public.ideas;
CREATE POLICY "Users can read all ideas"
  ON public.ideas FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own ideas" ON public.ideas;
CREATE POLICY "Users can insert own ideas"
  ON public.ideas FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read all support tickets" ON public.support_tickets;
CREATE POLICY "Users can read all support tickets"
  ON public.support_tickets FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own support tickets" ON public.support_tickets;
CREATE POLICY "Users can insert own support tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read all activity logs" ON public.activity_logs;
CREATE POLICY "Admins can read all activity logs"
  ON public.activity_logs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert activity logs" ON public.activity_logs;
CREATE POLICY "Anyone can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
CREATE POLICY "Public read access for avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
CREATE POLICY "Users can update own avatars"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars')
  WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
CREATE POLICY "Users can delete own avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION get_user_full_name(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT prenom || ' ' || nom FROM public.users WHERE id = user_uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION count_unread_notifications(user_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.notifications 
  WHERE user_id = user_uuid AND read = FALSE;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION get_active_members_count()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.users 
  WHERE status IN ('online', 'away');
$$ LANGUAGE sql STABLE;

-- ============================================
-- VIEWS
-- ============================================

CREATE OR REPLACE VIEW presidents_view AS
SELECT 
  u.id,
  u.prenom || ' ' || u.nom AS name,
  u.president_year AS year,
  u.avatar,
  u.photo_url,
  u.president_achievements AS achievements,
  u.president_color AS color,
  u.created_at
FROM public.users u
WHERE u.is_president = TRUE
ORDER BY u.president_year DESC;

CREATE OR REPLACE VIEW members_view AS
SELECT 
  u.id,
  u.prenom,
  u.nom,
  u.email,
  u.grade,
  u.avatar,
  u.photo_url,
  u.status,
  u.last_seen,
  u.created_at,
  COUNT(DISTINCT a.id) AS total_absences,
  COUNT(DISTINCT i.id) AS total_ideas,
  COUNT(DISTINCT s.id) AS total_support_tickets
FROM public.users u
LEFT JOIN public.absences a ON u.id = a.user_id
LEFT JOIN public.ideas i ON u.id = i.user_id
LEFT JOIN public.support_tickets s ON u.id = s.user_id
GROUP BY u.id
ORDER BY u.created_at DESC;

-- ============================================
-- PERMISSIONS
-- ============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon;

-- ============================================
-- MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Schema simplifié créé avec succès!';
  RAISE NOTICE '📊 Tables: absences, ideas, support_tickets, notifications, activity_logs';
  RAISE NOTICE '🔒 RLS Policies activées';
  RAISE NOTICE '⚡ Triggers configurés';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Prochaine étape: add-meetings-about.sql';
END $$;
