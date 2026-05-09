import { createClient } from './client';

export interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  grade: string;
  photo_url: string;
  was_president: boolean;
  president_year?: string;
  phone?: string;
  status?: string;
  join_date?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  prenom: string;
  nom: string;
  grade: string;
  photo: File;
  wasPresident: boolean;
  presidentYear?: string;
}

export const authService = {
  async register(data: RegisterData) {
    const supabase = createClient();

    // Upload photo to Supabase Storage
    const fileExt = data.photo.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, data.photo);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Create user in database
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          email: data.email,
          password_hash: await hashPassword(data.password),
          prenom: data.prenom,
          nom: data.nom,
          grade: data.grade,
          photo_url: publicUrl,
          was_president: data.wasPresident,
          president_year: data.presidentYear,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return user;
  },

  async login(email: string, password: string) {
    const supabase = createClient();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Identifiants invalides');
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new Error('Identifiants invalides');
    }

    // Update status to online
    await supabase
      .from('users')
      .update({ status: 'online' })
      .eq('id', user.id);

    return {
      id: user.id,
      email: user.email,
      name: `${user.prenom} ${user.nom}`,
      grade: user.grade,
      avatar: `${user.prenom[0]}${user.nom[0]}`.toUpperCase(),
      photo_url: user.photo_url,
    };
  },

  async logout(userId: string) {
    const supabase = createClient();
    await supabase
      .from('users')
      .update({ status: 'offline' })
      .eq('id', userId);
  },

  async getAllUsers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// Simple password hashing (in production, use bcrypt or similar)
async function hashPassword(password: string): Promise<string> {
  // For demo purposes - in production use proper hashing
  return btoa(password);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return btoa(password) === hash;
}
