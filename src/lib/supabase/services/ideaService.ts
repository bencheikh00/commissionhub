import { createClient } from '../client';
import type { Database } from '../types';

type Idea = Database['public']['Tables']['ideas']['Row'];
type IdeaInsert = Database['public']['Tables']['ideas']['Insert'];

export class IdeaService {
  private supabase = createClient();

  /**
   * Get all ideas with user details
   */
  async getAllIdeas(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('ideas')
      .select(`
        *,
        user:users(id, prenom, nom, email, grade, avatar, photo_url)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get ideas by user ID
   */
  async getIdeasByUserId(userId: string): Promise<Idea[]> {
    const { data, error } = await this.supabase
      .from('ideas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get pending ideas (not reviewed yet)
   */
  async getPendingIdeas(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('ideas')
      .select(`
        *,
        user:users(id, prenom, nom, email, grade, avatar, photo_url)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false});

    if (error) throw error;
    return data || [];
  }

  /**
   * Create new idea
   */
  async createIdea(ideaData: {
    userId: string;
    content: string;
  }): Promise<Idea> {
    const { data, error } = await this.supabase
      .from('ideas')
      .insert({
        user_id: ideaData.userId,
        content: ideaData.content,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update idea status
   */
  async updateIdeaStatus(
    ideaId: string,
    status: 'reviewed' | 'implemented' | 'rejected',
    reviewedBy: string,
    adminNotes?: string
  ): Promise<Idea> {
    const { data, error } = await this.supabase
      .from('ideas')
      .update({
        status,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes,
      })
      .eq('id', ideaId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete idea
   */
  async deleteIdea(ideaId: string): Promise<void> {
    const { error } = await this.supabase
      .from('ideas')
      .delete()
      .eq('id', ideaId);

    if (error) throw error;
  }

  /**
   * Get idea statistics
   */
  async getIdeaStats(): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    implemented: number;
    rejected: number;
  }> {
    const { data, error } = await this.supabase
      .from('ideas')
      .select('status');

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter((i) => i.status === 'pending').length,
      reviewed: data.filter((i) => i.status === 'reviewed').length,
      implemented: data.filter((i) => i.status === 'implemented').length,
      rejected: data.filter((i) => i.status === 'rejected').length,
    };

    return stats;
  }
}

export const ideaService = new IdeaService();
