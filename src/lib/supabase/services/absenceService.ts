import { createClient } from '../client';
import type { Database } from '../types';

type Absence = Database['public']['Tables']['absences']['Row'];
type AbsenceInsert = Database['public']['Tables']['absences']['Insert'];

export class AbsenceService {
  private supabase = createClient();

  /**
   * Get all absences with user details
   */
  async getAllAbsences(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('absences')
      .select(`
        *,
        user:users(id, prenom, nom, email, grade, avatar, photo_url)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get absences by user ID
   */
  async getAbsencesByUserId(userId: string): Promise<Absence[]> {
    const { data, error } = await this.supabase
      .from('absences')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get pending absences
   */
  async getPendingAbsences(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('absences')
      .select(`
        *,
        user:users(id, prenom, nom, email, grade, avatar, photo_url)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create new absence request
   */
  async createAbsence(absenceData: {
    userId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<Absence> {
    const { data, error } = await this.supabase
      .from('absences')
      .insert({
        user_id: absenceData.userId,
        start_date: absenceData.startDate,
        end_date: absenceData.endDate,
        reason: absenceData.reason,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update absence status (approve/reject)
   */
  async updateAbsenceStatus(
    absenceId: string,
    status: 'approved' | 'rejected',
    reviewedBy: string
  ): Promise<Absence> {
    const { data, error } = await this.supabase
      .from('absences')
      .update({
        status,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', absenceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete absence request
   */
  async deleteAbsence(absenceId: string): Promise<void> {
    const { error } = await this.supabase
      .from('absences')
      .delete()
      .eq('id', absenceId);

    if (error) throw error;
  }

  /**
   * Get absences by date range
   */
  async getAbsencesByDateRange(startDate: string, endDate: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('absences')
      .select(`
        *,
        user:users(id, prenom, nom, email, grade, avatar, photo_url)
      `)
      .gte('start_date', startDate)
      .lte('end_date', endDate)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get absence statistics
   */
  async getAbsenceStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    const { data, error } = await this.supabase
      .from('absences')
      .select('status');

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter((a) => a.status === 'pending').length,
      approved: data.filter((a) => a.status === 'approved').length,
      rejected: data.filter((a) => a.status === 'rejected').length,
    };

    return stats;
  }
}

export const absenceService = new AbsenceService();
