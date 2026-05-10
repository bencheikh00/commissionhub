import { createClient } from '../client';
import type { Database } from '../types';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export class UserService {
  private supabase = createClient();

  /**
   * Get all members (excluding presidents)
   */
  async getAllMembers(): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('is_president', false)
      .order('grade', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get members grouped by grade
   */
  async getMembersByGrade(): Promise<Record<string, User[]>> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('is_president', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const grouped: Record<string, User[]> = {};
    data?.forEach((user) => {
      if (!grouped[user.grade]) {
        grouped[user.grade] = [];
      }
      grouped[user.grade].push(user);
    });

    return grouped;
  }

  /**
   * Get all presidents (sans restriction d'année)
   */
  async getAllPresidents(): Promise<User[]> {
    console.log('🏆 Chargement des présidents...');
    
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('is_president', true)
      .order('president_year', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('❌ Erreur chargement présidents:', error);
      throw error;
    }
    
    console.log('✅ Présidents récupérés:', data?.length);
    console.log('📄 Liste des présidents:', data);
    
    return data || [];
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  /**
   * Create new user (registration)
   */
  async createUser(userData: {
    email: string;
    password: string;
    prenom: string;
    nom: string;
    grade: string;
    phone?: string;
    photoUrl?: string;
  }): Promise<User> {
    // Hash password (in production, use bcrypt)
    const passwordHash = btoa(userData.password); // Simple base64 for demo

    // Generate avatar initials
    const avatar = (userData.prenom[0] + userData.nom[0]).toUpperCase();

    const { data, error } = await this.supabase
      .from('users')
      .insert({
        email: userData.email,
        password_hash: passwordHash,
        prenom: userData.prenom,
        nom: userData.nom,
        grade: userData.grade,
        phone: userData.phone,
        photo_url: userData.photoUrl,
        avatar: avatar,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update user profile
   */
  async updateUser(id: string, updates: UserUpdate): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update user grade (self-promotion)
   */
  async updateUserGrade(userId: string, newGrade: string): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .update({ 
        grade: newGrade,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update user status (online/offline/away)
   */
  async updateUserStatus(id: string, status: 'online' | 'offline' | 'away'): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({ status, last_seen: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Verify user credentials (login)
   */
  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    // Verify password (in production, use bcrypt.compare)
    const passwordHash = btoa(password);
    if (user.password_hash !== passwordHash) return null;

    return user;
  }

  /**
   * Upload user avatar to Supabase Storage
   */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = this.supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Get members count by grade
   */
  async getMembersCountByGrade(): Promise<Record<string, number>> {
    const { data, error } = await this.supabase
      .from('users')
      .select('grade');

    if (error) throw error;

    const counts: Record<string, number> = {};
    data.forEach((user) => {
      counts[user.grade] = (counts[user.grade] || 0) + 1;
    });

    return counts;
  }

  /**
   * Get active members (online/away)
   */
  async getActiveMembers(): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .in('status', ['online', 'away'])
      .order('last_seen', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Search members by name or email
   */
  async searchMembers(query: string): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .or(`prenom.ilike.%${query}%,nom.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const userService = new UserService();
