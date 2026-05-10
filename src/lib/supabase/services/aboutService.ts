import { createClient } from '../client';
import type { Database } from '../types';

type AboutCommission = Database['public']['Tables']['about_commission']['Row'];

export class AboutService {
  private supabase = createClient();

  /**
   * Get about commission info
   */
  async getAboutInfo(): Promise<AboutCommission | null> {
    const { data, error } = await this.supabase
      .from('about_commission')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  /**
   * Update about commission info
   */
  async updateAboutInfo(updates: {
    mission?: string;
    vision?: string;
    history?: string;
    values?: any;
  }): Promise<AboutCommission> {
    // Get the first record
    const { data: existing } = await this.supabase
      .from('about_commission')
      .select('id')
      .limit(1)
      .single();

    if (!existing) {
      throw new Error('About commission record not found');
    }

    const { data, error } = await this.supabase
      .from('about_commission')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const aboutService = new AboutService();
