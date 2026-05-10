import { createClient } from '../client';
import type { Database } from '../types';

type Meeting = Database['public']['Tables']['meetings']['Row'];
type MeetingInsert = Database['public']['Tables']['meetings']['Insert'];

export class MeetingService {
  private supabase = createClient();

  /**
   * Get upcoming meetings (scheduled and not past)
   */
  async getUpcomingMeetings(): Promise<Meeting[]> {
    const { data, error } = await this.supabase
      .from('meetings')
      .select('*')
      .eq('status', 'scheduled')
      .gte('meeting_date', new Date().toISOString())
      .order('meeting_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get all meetings
   */
  async getAllMeetings(): Promise<Meeting[]> {
    const { data, error } = await this.supabase
      .from('meetings')
      .select('*')
      .order('meeting_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get meeting by ID
   */
  async getMeetingById(id: string): Promise<Meeting | null> {
    const { data, error } = await this.supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create new meeting
   */
  async createMeeting(meetingData: {
    title: string;
    description?: string;
    meeting_date: string;
    location?: string;
    agenda?: any;
    created_by: string;
  }): Promise<Meeting> {
    console.log('📝 Tentative de création réunion:', meetingData);
    
    const { data, error } = await this.supabase
      .from('meetings')
      .insert({
        title: meetingData.title,
        description: meetingData.description,
        meeting_date: meetingData.meeting_date,
        location: meetingData.location,
        agenda: meetingData.agenda,
        created_by: meetingData.created_by,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      console.error('❌ Code:', error.code);
      console.error('❌ Message:', error.message);
      console.error('❌ Details:', error.details);
      throw error;
    }
    
    console.log('✅ Réunion créée:', data);
    return data;
  }

  /**
   * Update meeting
   */
  async updateMeeting(id: string, updates: Partial<MeetingInsert>): Promise<Meeting> {
    const { data, error } = await this.supabase
      .from('meetings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete meeting
   */
  async deleteMeeting(id: string): Promise<boolean> {
    console.log('🗑️ Tentative de suppression réunion:', id);
    
    const { data, error } = await this.supabase
      .from('meetings')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Erreur suppression réunion:', error);
      console.error('❌ Code:', error.code);
      console.error('❌ Message:', error.message);
      console.error('❌ Details:', error.details);
      return false;
    }
    
    console.log('✅ Réunion supprimée:', data);
    return true;
  }
}

export const meetingService = new MeetingService();
