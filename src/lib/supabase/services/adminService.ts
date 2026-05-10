import { supabase } from '../client';
import { sendAbsenceApprovedEmail, sendAbsenceRejectedEmail, sendAbsenceDeletedEmail } from '@/lib/email/emailService';

// ============================================
// TYPES
// ============================================

export interface AdminStats {
  totalUsers: number;
  onlineUsers: number;
  pendingAbsences: number;
  openTickets: number;
  pendingIdeas: number;
  upcomingMeetings: number;
  totalLogos: number;
  activities24h: number;
}

export interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  grade: string;
  role: string;
  photo_url?: string;
  avatar: string;
  status: string;
  phone?: string;
  bio?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
  user_name: string;
  photo_url?: string;
  avatar: string;
}

// ============================================
// VÉRIFICATION ADMIN
// ============================================

export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) return false;
  return data.role === 'Admin';
}

// ============================================
// STATISTIQUES DASHBOARD
// ============================================

export async function getAdminStats(): Promise<AdminStats | null> {
  const { data, error } = await supabase.rpc('get_admin_dashboard_stats');

  if (error) {
    console.error('Error fetching admin stats:', error);
    return null;
  }

  return data as AdminStats;
}

export async function getRecentActivity(): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from('admin_recent_activity')
    .select('*')
    .limit(20);

  if (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }

  return data || [];
}

// ============================================
// GESTION UTILISATEURS (CRUD)
// ============================================

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data || [];
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
  console.log('🔄 Mise à jour utilisateur:', { userId, updates });
  
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select();

  if (error) {
    console.error('❌ Error updating user:', error);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
    alert(`Erreur: ${error.message || 'Impossible de mettre à jour l\'utilisateur'}`);
    return false;
  }

  console.log('✅ Utilisateur mis à jour avec succès:', data);
  return true;
}

export async function deleteUser(userId: string): Promise<boolean> {
  const { error } = await supabase.rpc('admin_delete_user', { user_uuid: userId });

  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }

  return true;
}

export async function updateUserGrade(userId: string, newGrade: string): Promise<boolean> {
  return updateUser(userId, { grade: newGrade });
}

export async function updateUserRole(userId: string, newRole: 'Admin' | 'User'): Promise<boolean> {
  return updateUser(userId, { role: newRole });
}

// ============================================
// GESTION ABSENCES
// ============================================

export async function getAllAbsences() {
  const { data, error } = await supabase
    .from('absences')
    .select(`
      *,
      user:users!absences_user_id_fkey(email, prenom, nom, photo_url, avatar, grade)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching absences:', error);
    return [];
  }

  return data || [];
}

export async function updateAbsenceStatus(
  absenceId: string,
  status: 'approved' | 'rejected',
  reviewedBy: string,
  adminEmail: string,
  adminName: string
): Promise<boolean> {
  console.log('🔄 Mise à jour absence:', { absenceId, status, reviewedBy });
  
  // Récupérer les infos de l'absence et de l'utilisateur
  const { data: absence, error: fetchError } = await supabase
    .from('absences')
    .select(`
      *,
      user:users!absences_user_id_fkey(email, prenom, nom)
    `)
    .eq('id', absenceId)
    .single();

  if (fetchError) {
    console.error('❌ Erreur récupération absence:', fetchError);
    return false;
  }

  console.log('📋 Absence trouvée:', absence);
  console.log('👤 User data:', absence.user);
  console.log('📧 Email utilisateur:', absence.user?.email);

  const { error } = await supabase
    .from('absences')
    .update({
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', absenceId);

  if (error) {
    console.error('❌ Error updating absence:', error);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
    alert(`Erreur: ${error.message || 'Impossible de mettre à jour'}`);
    return false;
  }

  console.log('✅ Absence mise à jour avec succès');

  // Envoyer email de notification avec email admin
  if (absence?.user) {
    const userName = `${absence.user.prenom} ${absence.user.nom}`;
    const startDate = new Date(absence.start_date).toLocaleDateString('fr-FR');
    const endDate = new Date(absence.end_date).toLocaleDateString('fr-FR');
    
    if (status === 'approved') {
      await sendAbsenceApprovedEmail(
        absence.user.email, 
        userName, 
        startDate, 
        endDate,
        adminEmail,
        adminName
      );
    } else {
      await sendAbsenceRejectedEmail(
        absence.user.email, 
        userName, 
        startDate, 
        endDate,
        adminEmail,
        adminName
      );
    }
  }

  return true;
}

export async function deleteAbsence(absenceId: string): Promise<boolean> {
  // Récupérer les infos avant suppression
  const { data: absence } = await supabase
    .from('absences')
    .select(`
      *,
      user:users!absences_user_id_fkey(email, prenom, nom)
    `)
    .eq('id', absenceId)
    .single();

  const { error } = await supabase
    .from('absences')
    .delete()
    .eq('id', absenceId);

  if (error) {
    console.error('Error deleting absence:', error);
    return false;
  }

  // Envoyer email de notification
  if (absence?.user) {
    const userName = `${absence.user.prenom} ${absence.user.nom}`;
    await sendAbsenceDeletedEmail(absence.user.email, userName);
  }

  return true;
}

// ============================================
// GESTION SUPPORT TICKETS
// ============================================

export async function getAllTickets() {
  const { data, error } = await supabase
    .from('support_tickets')
    .select(`
      *,
      user:users!support_tickets_user_id_fkey(prenom, nom, photo_url, avatar, email)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }

  return data || [];
}

export async function updateTicketStatus(
  ticketId: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed',
  assignedTo?: string
): Promise<boolean> {
  console.log('🔄 Tentative de mise à jour ticket:', { ticketId, status, assignedTo });
  
  const updates: any = { status };
  if (assignedTo) updates.assigned_to = assignedTo;
  if (status === 'resolved' || status === 'closed') {
    updates.resolved_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('support_tickets')
    .update(updates)
    .eq('id', ticketId)
    .select();

  if (error) {
    console.error('❌ Error updating ticket:', error);
    console.error('❌ Code:', error.code);
    console.error('❌ Message:', error.message);
    console.error('❌ Details:', error.details);
    return false;
  }

  console.log('✅ Ticket mis à jour avec succès:', data);
  return true;
}

export async function deleteTicket(ticketId: string): Promise<boolean> {
  console.log('🗑️ Tentative de suppression ticket:', ticketId);
  
  const { data, error } = await supabase
    .from('support_tickets')
    .delete()
    .eq('id', ticketId)
    .select();

  if (error) {
    console.error('❌ Error deleting ticket:', error);
    console.error('❌ Code:', error.code);
    console.error('❌ Message:', error.message);
    console.error('❌ Details:', error.details);
    return false;
  }

  console.log('✅ Ticket supprimé avec succès:', data);
  return true;
}

// ============================================
// GESTION IDÉES
// ============================================

export async function getAllIdeas() {
  console.log('📋 Récupération des idées actives...');
  
  const { data, error } = await supabase
    .from('ideas')
    .select(`
      *,
      user:users!ideas_user_id_fkey(prenom, nom, photo_url, avatar)
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ideas:', error);
    return [];
  }

  console.log('✅ Idées actives récupérées:', data?.length);
  return data || [];
}

export async function getDeletedIdeas() {
  console.log('📋 Récupération des idées supprimées...');
  
  const { data, error } = await supabase
    .from('ideas')
    .select(`
      *,
      user:users!ideas_user_id_fkey(prenom, nom, photo_url, avatar)
    `)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false });

  if (error) {
    console.error('Error fetching deleted ideas:', error);
    return [];
  }

  console.log('✅ Idées supprimées récupérées:', data?.length);
  return data || [];
}

export async function updateIdeaStatus(
  ideaId: string,
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected',
  reviewedBy: string,
  adminNotes?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('ideas')
    .update({
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      admin_notes: adminNotes,
    })
    .eq('id', ideaId);

  if (error) {
    console.error('Error updating idea:', error);
    return false;
  }

  return true;
}

export async function deleteIdea(ideaId: string): Promise<boolean> {
  console.log('🗑️ Tentative de suppression idée (soft delete):', ideaId);
  
  const { data, error } = await supabase
    .from('ideas')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', ideaId)
    .select();

  if (error) {
    console.error('❌ Erreur suppression idée:', error);
    console.error('❌ Code:', error.code);
    console.error('❌ Message:', error.message);
    console.error('❌ Details:', error.details);
    return false;
  }

  console.log('✅ Idée supprimée (soft delete):', data);
  return true;
}

export async function restoreIdea(ideaId: string): Promise<boolean> {
  console.log('♻️ Tentative de restauration idée:', ideaId);
  
  const { data, error } = await supabase
    .from('ideas')
    .update({ deleted_at: null })
    .eq('id', ideaId)
    .select();

  if (error) {
    console.error('❌ Erreur restauration idée:', error);
    console.error('❌ Code:', error.code);
    console.error('❌ Message:', error.message);
    return false;
  }

  console.log('✅ Idée restaurée:', data);
  return true;
}

export async function permanentDeleteIdea(ideaId: string): Promise<boolean> {
  console.log('🗑️ Tentative de suppression définitive idée:', ideaId);
  
  const { data, error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', ideaId)
    .select();

  if (error) {
    console.error('❌ Erreur suppression définitive idée:', error);
    console.error('❌ Code:', error.code);
    console.error('❌ Message:', error.message);
    return false;
  }

  console.log('✅ Idée supprimée définitivement:', data);
  return true;
}
