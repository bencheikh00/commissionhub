'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Edit2, Save, X, Mail, Phone, Calendar, Crown, Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    phone: '',
    grade: '',
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('ch_user');
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUser(user);
      loadProfile(userId || user.id);
    } else {
      router.push('/sign-up-login-screen');
    }
  }, [userId, router]);

  const loadProfile = async (id: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setProfileUser(data);
      setFormData({
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        phone: data.phone || '',
        grade: data.grade,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('users')
        .update({
          prenom: formData.prenom,
          nom: formData.nom,
          phone: formData.phone,
        })
        .eq('id', profileUser.id);

      if (error) throw error;

      // Update session
      const updatedUser = {
        ...currentUser,
        name: `${formData.prenom} ${formData.nom}`,
        avatar: `${formData.prenom[0]}${formData.nom[0]}`.toUpperCase(),
      };
      sessionStorage.setItem('ch_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      // Reload profile immediately
      await loadProfile(profileUser.id);
      setIsEditing(false);
      
      // Show success message
      alert('✅ Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const isOwnProfile = currentUser?.id === profileUser?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => router.back()}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex-shrink-0"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            {isOwnProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                <Edit2 size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Modifier</span>
                <span className="sm:hidden">Modifier</span>
              </button>
            )}
            {isEditing && (
              <div className="flex gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      prenom: profileUser.prenom,
                      nom: profileUser.nom,
                      email: profileUser.email,
                      phone: profileUser.phone || '',
                      grade: profileUser.grade,
                    });
                  }}
                  className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-border hover:bg-muted transition-all"
                >
                  <X size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Annuler</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span className="hidden sm:inline">Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} className="sm:w-4 sm:h-4" />
                      <span>Enregistrer</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content - Responsive */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Profile Header - Responsive */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            {/* Photo - Responsive */}
            <div className="relative flex-shrink-0">
              {profileUser?.photo_url ? (
                <img
                  src={profileUser.photo_url}
                  alt={`${profileUser.prenom} ${profileUser.nom}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full gradient-orange flex items-center justify-center text-primary-foreground font-800 text-3xl sm:text-4xl">
                  {profileUser?.prenom[0]}{profileUser?.nom[0]}
                </div>
              )}
              {isOwnProfile && isEditing && (
                <button className="absolute bottom-0 right-0 p-1.5 sm:p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all">
                  <Upload size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}
            </div>

            {/* Info - Responsive */}
            <div className="flex-1 text-center md:text-left w-full">
              {isEditing ? (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      placeholder="Prénom"
                      className="flex-1 px-3 py-2 text-sm rounded-lg bg-input border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="Nom"
                      className="flex-1 px-3 py-2 text-sm rounded-lg bg-input border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-800 text-foreground mb-2 break-words">
                    {profileUser?.prenom} {profileUser?.nom}
                  </h1>
                  <p className="text-base sm:text-lg text-primary font-600 mb-3 sm:mb-4">{profileUser?.grade}</p>
                </>
              )}
              
              {profileUser?.was_president && (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs sm:text-sm font-600">
                  <Crown size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Ancien président {profileUser.president_year && `(${profileUser.president_year})`}</span>
                  <span className="sm:hidden">Ex-Président</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details - Responsive */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-700 text-foreground mb-3 sm:mb-4">Informations</h2>
          
          <div className="space-y-3 sm:space-y-4">
            {/* Email - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/30">
              <Mail size={16} className="text-primary flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Email</p>
                <p className="text-xs sm:text-sm text-foreground font-600 truncate">{profileUser?.email}</p>
              </div>
            </div>

            {/* Phone - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/30">
              <Phone size={16} className="text-primary flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Téléphone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Numéro de téléphone"
                    className="w-full px-2 sm:px-3 py-1 rounded bg-input border border-border text-xs sm:text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-foreground font-600 truncate">
                    {profileUser?.phone || 'Non renseigné'}
                  </p>
                )}
              </div>
            </div>

            {/* Join Date - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/30">
              <Calendar size={16} className="text-primary flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Membre depuis</p>
                <p className="text-xs sm:text-sm text-foreground font-600">
                  {new Date(profileUser?.join_date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!isOwnProfile && (
          <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-[10px] sm:text-xs text-blue-400">
              ℹ️ Vous consultez le profil d'un autre membre. Vous ne pouvez pas modifier ses informations.
            </p>
          </div>
        )}
      </div>

      {/* Footer - Discret et Minimaliste */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="text-center space-y-1.5 sm:space-y-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground/70 font-500">
              © 2026 Commission Communication IAM | Keur Bourama. Tous droits réservés.
            </p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground/50 font-400 flex items-center justify-center gap-1">
              Développé avec <span className="text-primary/70">🧡</span> par <span className="font-600 text-primary/80">SBCS</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
