'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/lib/supabase';

export default function AbsencesManagement({ currentUserId }: { currentUserId: string }) {
  const [absences, setAbsences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ absenceId: string; status: 'approved' | 'rejected' } | null>(null);
  const [adminInfo, setAdminInfo] = useState<{ email: string; name: string }>({ email: '', name: '' });

  useEffect(() => {
    loadAbsences();
    loadAdminInfo();
  }, []);

  async function loadAdminInfo() {
    const stored = sessionStorage.getItem('ch_user');
    if (stored) {
      const user = JSON.parse(stored);
      // Récupérer l'email depuis la DB
      const { supabase } = await import('@/lib/supabase/client');
      const { data } = await supabase
        .from('users')
        .select('email')
        .eq('id', currentUserId)
        .single();
      
      setAdminInfo({
        email: data?.email || 'admin@commissionhub.com',
        name: user.name || 'Administrateur'
      });
    }
  }

  async function loadAbsences() {
    console.log('🔄 Chargement des absences...');
    const data = await adminService.getAllAbsences();
    console.log('📊 Absences chargées:', data.length);
    console.log('📊 Détail absences:', data.map(a => ({ id: a.id, status: a.status })));
    setAbsences(data);
    setLoading(false);
  }

  async function handleUpdateStatus(absenceId: string, status: 'approved' | 'rejected') {
    setConfirmAction({ absenceId, status });
    setShowConfirmModal(true);
  }

  async function confirmUpdateStatus() {
    if (!confirmAction) return;
    
    setShowConfirmModal(false);
    const { absenceId, status } = confirmAction;
    
    console.log('📧 Infos admin pour email:', adminInfo);
    
    const success = await adminService.updateAbsenceStatus(
      absenceId, 
      status, 
      currentUserId,
      adminInfo.email,
      adminInfo.name
    );
    
    if (success) {
      console.log('✅ Mise à jour réussie, rechargement des absences...');
      
      // Message de confirmation
      const message = status === 'approved' 
        ? '✅ Demande approuvée'
        : '❌ Demande rejetée';
      
      const notification = document.createElement('div');
      notification.className = `fixed top-4 right-4 ${status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'} text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in`;
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi ${status === 'approved' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} text-2xl"></i>
          <div>
            <p class="font-bold">${message}</p>
            <p class="text-sm opacity-90">📧 Email envoyé à l'utilisateur</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
      
      // Recharger les absences pour mettre à jour l'affichage
      await loadAbsences();
      console.log('✅ Absences rechargées');
    } else {
      alert('❌ Erreur lors de la mise à jour. Vérifiez la console.');
    }
    
    setConfirmAction(null);
  }

  async function handleDelete(absenceId: string) {
    if (!confirm('Supprimer cette demande ? L\'utilisateur sera notifié par email.')) return;
    const success = await adminService.deleteAbsence(absenceId);
    if (success) {
      // Message de confirmation
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-trash-fill text-2xl"></i>
          <div>
            <p class="font-bold">🗑️ Demande supprimée</p>
            <p class="text-sm opacity-90">L'utilisateur a été notifié par email</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
      
      await loadAbsences();
    }
  }

  const filteredAbsences = filter === 'all' ? absences : absences.filter(a => a.status === filter);
  
  console.log('🔍 Filtre actuel:', filter);
  console.log('🔍 Absences filtrées:', filteredAbsences.length);

  if (loading) {
    return <div className="text-center py-12"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Modal de confirmation */}
      {showConfirmModal && confirmAction && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-border rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  confirmAction.status === 'approved' 
                    ? 'bg-green-500/10' 
                    : 'bg-red-500/10'
                }`}>
                  <i className={`bi text-3xl ${
                    confirmAction.status === 'approved'
                      ? 'bi-check-circle text-green-400'
                      : 'bi-x-circle text-red-400'
                  }`}></i>
                </div>
              </div>

              <h2 className="text-xl font-800 text-foreground text-center mb-3">
                {confirmAction.status === 'approved' ? 'Approuver la demande ?' : 'Rejeter la demande ?'}
              </h2>
              <p className="text-muted-foreground text-center mb-6">
                {confirmAction.status === 'approved' 
                  ? 'L\'utilisateur sera notifié par email que sa demande a été approuvée.'
                  : 'L\'utilisateur sera notifié par email que sa demande a été rejetée.'}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-600 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmUpdateStatus}
                  className={`flex-1 py-3 px-4 rounded-xl font-600 transition-all ${
                    confirmAction.status === 'approved'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {confirmAction.status === 'approved' ? 'Approuver' : 'Rejeter'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="bi bi-calendar-x text-primary"></i>
          Gestion des Absences
          <span className="text-sm font-normal text-white/60 ml-2">({filteredAbsences.length} demandes)</span>
        </h2>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                filter === f
                  ? 'bg-primary text-white shadow-neon-orange'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {f === 'all' ? 'Toutes' : f === 'pending' ? 'En attente' : f === 'approved' ? 'Approuvées' : 'Rejetées'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAbsences.map((absence) => (
          <div key={absence.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all">
            <div className="flex items-start gap-4">
              {absence.user?.photo_url ? (
                <img src={absence.user.photo_url} alt={absence.user.prenom} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold">
                  {absence.user?.avatar}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{absence.user?.prenom} {absence.user?.nom}</h3>
                  <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">{absence.user?.grade}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    absence.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    absence.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {absence.status === 'pending' ? 'En attente' : absence.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-white/60">Du</p>
                    <p className="text-white">{new Date(absence.start_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Au</p>
                    <p className="text-white">{new Date(absence.end_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Demandé le</p>
                    <p className="text-white">{new Date(absence.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-white/60 text-sm mb-1">Raison</p>
                  <p className="text-white">{absence.reason}</p>
                </div>

                {absence.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(absence.id, 'approved')}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-all flex items-center gap-2"
                    >
                      <i className="bi bi-check-circle"></i>
                      Approuver
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(absence.id, 'rejected')}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-all flex items-center gap-2"
                    >
                      <i className="bi bi-x-circle"></i>
                      Rejeter
                    </button>
                    <button
                      onClick={() => handleDelete(absence.id)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/60 rounded-lg text-sm transition-all ml-auto"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                )}

                {absence.status !== 'pending' && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(absence.id)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/60 rounded-lg text-sm transition-all"
                    >
                      <i className="bi bi-trash mr-2"></i>
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAbsences.length === 0 && (
          <div className="text-center py-12">
            <i className="bi bi-inbox text-6xl text-white/20 mb-4 block"></i>
            <p className="text-white/60">Aucune demande d'absence</p>
          </div>
        )}
      </div>
    </div>
  );
}
