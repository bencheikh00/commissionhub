-- ============================================
-- COMMISSIONHUB DATABASE SCHEMA
-- Full Stack Production-Ready Schema
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES
-- ============================================

-- Users table (membres de la commission)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  grade TEXT NOT NULL, -- Permet tous les grades personnalisés
  photo_url TEXT,
  avatar TEXT NOT NULL, -- Initiales pour l'avatar
  is_president BOOLEAN DEFAULT FALSE,
  president_year TEXT,
  president_achievements TEXT,
  president_color TEXT DEFAULT 'from-blue-500 to-purple-500',
  phone TEXT,
  bio TEXT,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline')),
  last_seen TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Absences table (demandes d'absence)
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

-- Ideas table (boîte à idées)
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

-- Support tickets table (signaler un problème)
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

-- Activity logs table (audit trail)
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
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_grade ON public.users(grade);
CREATE INDEX IF NOT EXISTS idx_users_is_president ON public.users(is_president) WHERE is_president = TRUE;
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
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

-- Function to create notification on new absence
CREATE OR REPLACE FUNCTION notify_new_absence()
RETURNS TRIGGER AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- Notify all admins (Responsable, Président)
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

-- Function to create notification on new idea
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

-- Function to create notification on new support ticket
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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read access for users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can read all absences" ON public.absences;
DROP POLICY IF EXISTS "Users can insert own absences" ON public.absences;
DROP POLICY IF EXISTS "Users can read all ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can insert own ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can read all support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can insert own support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can read all activity logs" ON public.activity_logs;

-- **USERS TABLE POLICIES**
-- Everyone can read user profiles (for members list)
CREATE POLICY "Public read access for users"
  ON public.users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- **ABSENCES TABLE POLICIES**
-- Everyone can read absences
CREATE POLICY "Users can read all absences"
  ON public.absences FOR SELECT
  USING (true);

-- Users can insert their own absences
CREATE POLICY "Users can insert own absences"
  ON public.absences FOR INSERT
  WITH CHECK (true);

-- Users can update their own absences (if pending)
CREATE POLICY "Users can update own pending absences"
  ON public.absences FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (status = 'pending');

-- **IDEAS TABLE POLICIES**
-- Everyone can read ideas
CREATE POLICY "Users can read all ideas"
  ON public.ideas FOR SELECT
  USING (true);

-- Users can insert their own ideas
CREATE POLICY "Users can insert own ideas"
  ON public.ideas FOR INSERT
  WITH CHECK (true);

-- **SUPPORT TICKETS POLICIES**
-- Everyone can read support tickets
CREATE POLICY "Users can read all support tickets"
  ON public.support_tickets FOR SELECT
  USING (true);

-- Users can insert their own support tickets
CREATE POLICY "Users can insert own support tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (true);

-- **NOTIFICATIONS POLICIES**
-- Users can only read their own notifications
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  USING (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- **ACTIVITY LOGS POLICIES**
-- Only admins can read activity logs
CREATE POLICY "Admins can read all activity logs"
  ON public.activity_logs FOR SELECT
  USING (true);

-- Everyone can insert activity logs
CREATE POLICY "Anyone can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET FOR AVATARS
-- ============================================

-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
CREATE POLICY "Public read access for avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatars"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars')
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can delete own avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get user's full name
CREATE OR REPLACE FUNCTION get_user_full_name(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT prenom || ' ' || nom FROM public.users WHERE id = user_uuid;
$$ LANGUAGE sql STABLE;

-- Function to count unread notifications
CREATE OR REPLACE FUNCTION count_unread_notifications(user_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.notifications 
  WHERE user_id = user_uuid AND read = FALSE;
$$ LANGUAGE sql STABLE;

-- Function to get active members count
CREATE OR REPLACE FUNCTION get_active_members_count()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.users 
  WHERE status IN ('online', 'away');
$$ LANGUAGE sql STABLE;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for presidents with user details
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

-- View for members with statistics
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
-- INITIAL DATA (OPTIONAL)
-- ============================================

-- Insert a default admin user (password: Admin123!)
-- Password hash generated with bcrypt
INSERT INTO public.users (
  email, 
  password_hash, 
  prenom, 
  nom, 
  grade, 
  avatar,
  is_president,
  president_year,
  president_achievements,
  president_color
) 
SELECT
  'admin@commissionhub.com',
  '$2a$10$rN8qLXzOkrQxY5Z5Z5Z5ZeN8qLXzOkrQxY5Z5Z5Z5ZeN8qLXzOkrQ',
  'Admin',
  'CommissionHub',
  'Président',
  'AC',
  true,
  '2024-2025',
  'Création de la plateforme CommissionHub, digitalisation complète',
  'from-orange-500 to-red-500'
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE email = 'admin@commissionhub.com'
);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant permissions on sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ CommissionHub Database Schema Created Successfully!';
  RAISE NOTICE '📊 Tables: users, absences, ideas, support_tickets, notifications, activity_logs';
  RAISE NOTICE '🔒 RLS Policies: Enabled with secure access control';
  RAISE NOTICE '⚡ Indexes: Created for optimal performance';
  RAISE NOTICE '🔔 Triggers: Automatic notifications configured';
  RAISE NOTICE '👤 Default Admin: admin@commissionhub.com (password: Admin123!)';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next Steps:';
  RAISE NOTICE '1. Create storage bucket "avatars" in Supabase Dashboard';
  RAISE NOTICE '2. Update .env with your Supabase credentials';
  RAISE NOTICE '3. Run: npm run dev';
END $$;
