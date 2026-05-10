import { supabase } from '../client';

// ============================================
// TYPES
// ============================================

export interface Logo {
  id: string;
  name: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  category: 'official' | 'event' | 'social';
  uploaded_by?: string;
  downloads_count: number;
  created_at: string;
}

// ============================================
// RÉCUPÉRATION LOGOS
// ============================================

export async function getAllLogos(): Promise<Logo[]> {
  const { data, error } = await supabase
    .from('logos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching logos:', error);
    return [];
  }

  return data || [];
}

export async function getLogosByCategory(category: string): Promise<Logo[]> {
  const { data, error } = await supabase
    .from('logos')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching logos by category:', error);
    return [];
  }

  return data || [];
}

// ============================================
// UPLOAD LOGO (ADMIN ONLY)
// ============================================

export async function uploadLogo(
  file: File,
  metadata: {
    name: string;
    description?: string;
    category: 'official' | 'event' | 'social';
    uploadedBy: string;
  }
): Promise<Logo | null> {
  try {
    // 1. Upload fichier vers storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${metadata.category}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }

    // 2. Obtenir URL publique
    const { data: urlData } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    // 3. Créer entrée dans la table logos
    console.log('📝 Tentative d\'insertion:', {
      name: metadata.name,
      description: metadata.description,
      file_url: urlData.publicUrl,
      file_type: fileExt || 'unknown',
      file_size: file.size,
      category: metadata.category,
      uploaded_by: metadata.uploadedBy,
    });

    const { data, error } = await supabase
      .from('logos')
      .insert({
        name: metadata.name,
        description: metadata.description,
        file_url: urlData.publicUrl,
        file_type: fileExt || 'unknown',
        file_size: file.size,
        category: metadata.category,
        uploaded_by: metadata.uploadedBy,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating logo entry:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      alert(`Erreur: ${error.message || 'Impossible de créer l\'entrée'}`);
      return null;
    }

    console.log('✅ Logo créé avec succès:', data);
    return data;
  } catch (error) {
    console.error('Error in uploadLogo:', error);
    return null;
  }
}

// ============================================
// MISE À JOUR LOGO
// ============================================

export async function updateLogo(
  logoId: string,
  updates: Partial<Pick<Logo, 'name' | 'description' | 'category'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('logos')
    .update(updates)
    .eq('id', logoId);

  if (error) {
    console.error('Error updating logo:', error);
    return false;
  }

  return true;
}

// ============================================
// SUPPRESSION LOGO
// ============================================

export async function deleteLogo(logoId: string): Promise<boolean> {
  try {
    // 1. Récupérer l'URL du fichier
    const { data: logo } = await supabase
      .from('logos')
      .select('file_url')
      .eq('id', logoId)
      .single();

    if (!logo) return false;

    // 2. Extraire le chemin du fichier depuis l'URL
    const url = new URL(logo.file_url);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('logos') + 1).join('/');

    // 3. Supprimer le fichier du storage
    const { error: storageError } = await supabase.storage
      .from('logos')
      .remove([filePath]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
    }

    // 4. Supprimer l'entrée de la table
    const { error } = await supabase
      .from('logos')
      .delete()
      .eq('id', logoId);

    if (error) {
      console.error('Error deleting logo entry:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteLogo:', error);
    return false;
  }
}

// ============================================
// INCRÉMENTER COMPTEUR TÉLÉCHARGEMENTS
// ============================================

export async function incrementDownloadCount(logoId: string): Promise<void> {
  const { error } = await supabase.rpc('increment', {
    table_name: 'logos',
    row_id: logoId,
    column_name: 'downloads_count',
  });

  if (error) {
    // Fallback: update manuel
    const { data: logo } = await supabase
      .from('logos')
      .select('downloads_count')
      .eq('id', logoId)
      .single();

    if (logo) {
      await supabase
        .from('logos')
        .update({ downloads_count: (logo.downloads_count || 0) + 1 })
        .eq('id', logoId);
    }
  }
}

// ============================================
// TÉLÉCHARGER LOGO
// ============================================

export async function downloadLogo(logoId: string, fileUrl: string, fileName: string): Promise<void> {
  try {
    // Incrémenter le compteur
    await incrementDownloadCount(logoId);

    // Télécharger le fichier
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading logo:', error);
  }
}
