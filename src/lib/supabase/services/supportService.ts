import { createClient } from '../client';
import type { Database } from '../types';

type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];
type SupportTicketInsert = Database['public']['Tables']['support_tickets']['Insert'];

export class SupportService {
  private supabase = createClient();

  /**
   * Get all support tickets with user details
   */
  async getAllTickets(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('support_tickets')
      .select(`
        *,
        user:users!support_tickets_user_id_fkey(id, prenom, nom, email, grade, avatar, photo_url),
        assigned:users!support_tickets_assigned_to_fkey(id, prenom, nom, email, grade, avatar)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get tickets by user ID
   */
  async getTicketsByUserId(userId: string): Promise<SupportTicket[]> {
    const { data, error } = await this.supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get open tickets
   */
  async getOpenTickets(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('support_tickets')
      .select(`
        *,
        user:users!support_tickets_user_id_fkey(id, prenom, nom, email, grade, avatar, photo_url)
      `)
      .eq('status', 'open')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create new support ticket
   */
  async createTicket(ticketData: {
    userId: string;
    subject: string;
    message: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }): Promise<SupportTicket> {
    const { data, error } = await this.supabase
      .from('support_tickets')
      .insert({
        user_id: ticketData.userId,
        subject: ticketData.subject,
        message: ticketData.message,
        priority: ticketData.priority || 'medium',
        status: 'open',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update ticket status
   */
  async updateTicketStatus(
    ticketId: string,
    status: 'open' | 'in_progress' | 'resolved' | 'closed'
  ): Promise<SupportTicket> {
    const updates: any = { status };
    
    if (status === 'resolved' || status === 'closed') {
      updates.resolved_at = new Date().toISOString();
    }

    const { data, error } = await this.supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Assign ticket to admin
   */
  async assignTicket(ticketId: string, assignedTo: string): Promise<SupportTicket> {
    const { data, error } = await this.supabase
      .from('support_tickets')
      .update({
        assigned_to: assignedTo,
        status: 'in_progress',
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete ticket
   */
  async deleteTicket(ticketId: string): Promise<void> {
    const { error } = await this.supabase
      .from('support_tickets')
      .delete()
      .eq('id', ticketId);

    if (error) throw error;
  }

  /**
   * Get ticket statistics
   */
  async getTicketStats(): Promise<{
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
    by_priority: Record<string, number>;
  }> {
    const { data, error } = await this.supabase
      .from('support_tickets')
      .select('status, priority');

    if (error) throw error;

    const stats = {
      total: data.length,
      open: data.filter((t) => t.status === 'open').length,
      in_progress: data.filter((t) => t.status === 'in_progress').length,
      resolved: data.filter((t) => t.status === 'resolved').length,
      closed: data.filter((t) => t.status === 'closed').length,
      by_priority: {
        low: data.filter((t) => t.priority === 'low').length,
        medium: data.filter((t) => t.priority === 'medium').length,
        high: data.filter((t) => t.priority === 'high').length,
        urgent: data.filter((t) => t.priority === 'urgent').length,
      },
    };

    return stats;
  }
}

export const supportService = new SupportService();
