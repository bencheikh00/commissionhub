import React, { useState } from 'react';
import type { Database } from '@/lib/supabase/types';
import { userService, GRADE_HIERARCHY } from '@/lib/supabase';

type User = Database['public']['Tables']['users']['Row'];

interface ProfileViewProps {
  member: User;
  currentUserId: string | undefined;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function ProfileView({ member, currentUserId, onClose, onUpdate }: ProfileViewProps) {
  const isOwnProfile = member.id === currentUserId;
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentGradeIndex = GRADE_HIERARCHY.indexOf(member.grade as any);
  const nextGrade = currentGradeIndex < GRADE_HIERARCHY.length - 1 
    ? GRADE_HIERARCHY[currentGradeIndex + 1] 
    : null;

  const handleGradePromotion = async () => {
    if (!nextGrade || !member.id) return;

    setIsUpdating(true);
    try {
      await userService.updateUserGrade(member.id, nextGrade);
      alert(`✅ Félicitations ! Vous êtes maintenant ${nextGrade}`);
      setShowGradeModal(false);
      if (onUpdate) onUpdate();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la mise à jour du grade');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Grade Promotion Modal */}
      {showGradeModal && isOwnProfile && nextGrade && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setShowGradeModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-slide-up">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <i className="bi bi-arrow-up-circle-fill text-3xl text-primary"></i>
                </div>
              </div>

              <h2 className="text-2xl font-800 text-foreground text-center mb-3">
                Évolution de Grade
              </h2>
              <p className="text-muted-foreground text-center mb-6">
                Voulez-vous passer au grade supérieur ?
              </p>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="px-4 py-2 rounded-lg bg-muted border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Grade actuel</p>
                    <p className="text-lg font-700 text-foreground">{member.grade}</p>
                  </div>
                </div>
                <i className="bi bi-arrow-right text-2xl text-primary"></i>
                <div className="text-center">
                  <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
                    <p className="text-xs text-primary mb-1">Nouveau grade</p>
                    <p className="text-lg font-700 text-primary">{nextGrade}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 mb-6">
                <div className="flex items-start gap-3">
                  <i className="bi bi-info-circle-fill text-blue-400 text-lg flex-shrink-0 mt-0.5"></i>
                  <p className="text-xs text-muted-foreground">
                    Cette action mettra à jour votre grade immédiatement dans toute la plateforme.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowGradeModal(false)}
                  disabled={isUpdating}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-600 transition-all duration-200 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleGradePromotion}
                  disabled={isUpdating}
                  className="flex-1 py-3 px-4 rounded-xl gradient-orange text-primary-foreground font-600 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="bi bi-arrow-repeat animate-spin"></i>
                      Mise à jour...
                    </span>
                  ) : (
                    'Confirmer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-800 text-foreground flex items-center gap-2">
            <i className="bi bi-person-circle text-primary"></i>
            Profil de {member.prenom} {member.nom}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isOwnProfile ? 'Votre profil' : 'Consultation uniquement'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          <i className="bi bi-x-lg text-lg"></i>
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Header avec avatar */}
        <div className="relative h-32 bg-gradient-to-r from-primary via-accent to-primary">
          <div className="absolute -bottom-12 left-8">
            {member.photo_url ? (
              <img 
                src={member.photo_url} 
                alt={`${member.prenom} ${member.nom}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-card shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full gradient-orange flex items-center justify-center text-primary-foreground font-800 text-3xl border-4 border-card shadow-xl">
                {member.avatar}
              </div>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1.5 rounded-full text-xs font-600 ${
              member.status === 'online' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              member.status === 'away' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              <i className={`bi ${
                member.status === 'online' ? 'bi-circle-fill' :
                member.status === 'away' ? 'bi-clock-fill' : 'bi-circle'
              } mr-1`}></i>
              {member.status === 'online' ? 'En ligne' :
               member.status === 'away' ? 'Absent' : 'Hors ligne'}
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="p-8 pt-16">
          {/* Nom et Grade */}
          <div className="mb-6">
            <h3 className="text-2xl font-800 text-foreground mb-2">
              {member.prenom} {member.nom}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-600 ${
                member.grade === 'Président' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30' :
                member.grade === 'Responsable' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/30' :
                member.grade === 'Adjoint' ? 'bg-purple-400/10 text-purple-400 border border-purple-400/30' :
                'bg-muted text-muted-foreground border border-border'
              }`}>
                <i className="bi bi-award-fill mr-1"></i>
                {member.grade}
              </span>
              {member.is_president && (
                <span className="px-3 py-1 rounded-full text-sm font-600 bg-orange-400/10 text-orange-400 border border-orange-400/30">
                  <i className="bi bi-trophy-fill mr-1"></i>
                  Ancien Président
                </span>
              )}
            </div>
          </div>

          {/* Informations de contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <i className="bi bi-envelope-fill"></i>
                <span className="text-xs font-600 uppercase">Email</span>
              </div>
              <p className="text-foreground font-500 break-all">{member.email}</p>
            </div>
            {member.phone && (
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <i className="bi bi-telephone-fill"></i>
                  <span className="text-xs font-600 uppercase">Téléphone</span>
                </div>
                <p className="text-foreground font-500">{member.phone}</p>
              </div>
            )}
          </div>

          {/* Bio */}
          {member.bio && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <i className="bi bi-info-circle-fill"></i>
                <span className="text-sm font-600 uppercase">Biographie</span>
              </div>
              <p className="text-foreground leading-relaxed">{member.bio}</p>
            </div>
          )}

          {/* Informations président */}
          {member.is_president && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
              <div className="flex items-center gap-2 text-primary mb-2">
                <i className="bi bi-trophy-fill"></i>
                <span className="text-sm font-700 uppercase">Mandat Présidentiel</span>
              </div>
              <p className="text-foreground font-600 mb-2">Année : {member.president_year}</p>
              {member.president_achievements && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.president_achievements}
                </p>
              )}
            </div>
          )}

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl bg-muted/30 border border-border">
              <i className="bi bi-calendar-check text-2xl text-primary mb-2"></i>
              <p className="text-xs text-muted-foreground">Membre depuis</p>
              <p className="text-sm font-700 text-foreground">
                {new Date(member.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30 border border-border">
              <i className="bi bi-clock-history text-2xl text-primary mb-2"></i>
              <p className="text-xs text-muted-foreground">Dernière activité</p>
              <p className="text-sm font-700 text-foreground">
                {new Date(member.last_seen).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30 border border-border">
              <i className="bi bi-shield-check text-2xl text-primary mb-2"></i>
              <p className="text-xs text-muted-foreground">Statut</p>
              <p className="text-sm font-700 text-foreground">Vérifié</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => alert('🛠️ Fonctionnalité de modification du profil à venir')}
                  className="w-full py-3 px-4 rounded-xl bg-primary/10 text-primary font-700 hover:bg-primary/20 transition-all border border-primary/30"
                >
                  <i className="bi bi-pencil-fill mr-2"></i>
                  Modifier mon profil
                </button>
                {nextGrade && (
                  <button
                    onClick={() => setShowGradeModal(true)}
                    className="w-full py-3 px-4 rounded-xl gradient-orange text-primary-foreground font-700 hover:opacity-90 transition-all"
                  >
                    <i className="bi bi-arrow-up-circle-fill mr-2"></i>
                    Évoluer vers {nextGrade}
                  </button>
                )}
              </>
            ) : (
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => window.location.href = `mailto:${member.email}`}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary/10 text-primary font-700 hover:bg-primary/20 transition-all border border-primary/30"
                >
                  <i className="bi bi-envelope-fill mr-2"></i>
                  Envoyer un email
                </button>
                {member.phone && (
                  <button
                    onClick={() => window.location.href = `tel:${member.phone}`}
                    className="flex-1 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-700 transition-all border border-border"
                  >
                    <i className="bi bi-telephone-fill mr-2"></i>
                    Appeler
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Note de sécurité */}
          {!isOwnProfile && (
            <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <i className="bi bi-info-circle-fill text-blue-400 text-lg flex-shrink-0 mt-0.5"></i>
                <div>
                  <p className="text-sm font-600 text-blue-400 mb-1">Consultation uniquement</p>
                  <p className="text-xs text-muted-foreground">
                    Vous pouvez consulter ce profil mais vous ne pouvez pas le modifier. Seul le propriétaire peut modifier ses informations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
