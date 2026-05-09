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

      await loadProfile(profileUser.id);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const isOwnProfile = currentUser?.id === profileUser?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            {isOwnProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                <Edit2 size={16} />
                Modifier
              </button>
            )}
            {isEditing && (
              <div className="flex gap-2">
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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-all"
                >
                  <X size={16} />
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-xl border border-border p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Photo */}
            <div className="relative">
              {profileUser?.photo_url ? (
                <img
                  src={profileUser.photo_url}
                  alt={`${profileUser.prenom} ${profileUser.nom}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-32 h-32 rounded-full gradient-orange flex items-center justify-center text-primary-foreground font-800 text-4xl">
                  {profileUser?.prenom[0]}{profileUser?.nom[0]}
                </div>
              )}
              {isOwnProfile && isEditing && (
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all">
                  <Upload size={16} />
                </button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      placeholder="Prénom"
                      className="flex-1 px-4 py-2 rounded-lg bg-input border border-border text-foreground"
                    />
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="Nom"
                      className="flex-1 px-4 py-2 rounded-lg bg-input border border-border text-foreground"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-800 text-foreground mb-2">
                    {profileUser?.prenom} {profileUser?.nom}
                  </h1>
                  <p className="text-lg text-primary font-600 mb-4">{profileUser?.grade}</p>
                </>
              )}
              
              {profileUser?.was_president && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-600">
                  <Crown size={14} />
                  Ancien président {profileUser.president_year && `(${profileUser.president_year})`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-700 text-foreground mb-4">Informations</h2>
          
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Mail size={18} className="text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground font-600">{profileUser?.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Phone size={18} className="text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Téléphone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Numéro de téléphone"
                    className="w-full px-3 py-1 rounded bg-input border border-border text-sm text-foreground"
                  />
                ) : (
                  <p className="text-sm text-foreground font-600">
                    {profileUser?.phone || 'Non renseigné'}
                  </p>
                )}
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Calendar size={18} className="text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Membre depuis</p>
                <p className="text-sm text-foreground font-600">
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
          <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-400">
              ℹ️ Vous consultez le profil d'un autre membre. Vous ne pouvez pas modifier ses informations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
