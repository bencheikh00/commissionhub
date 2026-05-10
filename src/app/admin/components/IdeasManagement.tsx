'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/lib/supabase';

export default function IdeasManagement({ currentUserId }: { currentUserId: string }) {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [deletedIdeas, setDeletedIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed'>('pending');
  const [tab, setTab] = useState<'active' | 'deleted'>('active');
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
  const [actionData, setActionData] = useState<{ ideaId: string; action: 'reviewed'; idea: any } | null>(null);
  const [deleteData, setDeleteData] = useState<{ ideaId: string; idea: any } | null>(null);
  const [permanentDeleteData, setPermanentDeleteData] = useState<{ ideaId: string; idea: any } | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadIdeas();
    loadDeletedIdeas();
    
    const interval = setInterval(() => {
      loadIdeas();
      loadDeletedIdeas();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  async function loadIdeas() {
    const data = await adminService.getAllIdeas();
    setIdeas(data);
    setLoading(false);
  }

  async function loadDeletedIdeas() {
    const data = await adminService.getDeletedIdeas();
    setDeletedIdeas(data);
  }

  function openActionModal(ideaId: string, action: 'reviewed', idea: any) {
    setActionData({ ideaId, action, idea });
    setAdminNotes('');
    setShowActionModal(true);
  }

  async function confirmAction() {
    if (!actionData) return;
    
    const success = await adminService.updateIdeaStatus(
      actionData.ideaId, 
      actionData.action, 
      currentUserId, 
      adminNotes || undefined
    );
    
    if (success) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-eye-fill text-2xl"></i>
          <div>
            <p class="font-bold">👁️ Idée examinée</p>
            <p class="text-sm opacity-90">L'utilisateur sera notifié</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      await loadIdeas();
    }
    
    setShowActionModal(false);
    setActionData(null);
    setAdminNotes('');
  }

  function openDeleteModal(ideaId: string, idea: any) {
    setDeleteData({ ideaId, idea });
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!deleteData) return;
    
    console.log('🗑️ Début suppression idée:', deleteData);
    
    const success = await adminService.deleteIdea(deleteData.ideaId);
    
    console.log('🔍 Résultat suppression:', success);
    
    if (success) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-trash-fill text-2xl"></i>
          <div>
            <p class="font-bold">🗑️ Idée supprimée</p>
            <p class="text-sm opacity-90">Déplacée dans la corbeille</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      await loadIdeas();
      await loadDeletedIdeas();
    } else {
      // Notification d'erreur
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-exclamation-triangle-fill text-2xl"></i>
          <div>
            <p class="font-bold">❌ Erreur de suppression</p>
            <p class="text-sm opacity-90">Impossible de supprimer l'idée. Vérifiez la console.</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
    }
    
    setShowDeleteModal(false);
    setDeleteData(null);
  }

  async function handleRestore(ideaId: string) {
    console.log('♻️ Début restauration idée:', ideaId);
    
    const success = await adminService.restoreIdea(ideaId);
    
    console.log('🔍 Résultat restauration:', success);
    
    if (success) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-arrow-counterclockwise text-2xl"></i>
          <div>
            <p class="font-bold">✅ Idée restaurée</p>
            <p class="text-sm opacity-90">L'idée est de nouveau active</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      await loadIdeas();
      await loadDeletedIdeas();
    } else {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-exclamation-triangle-fill text-2xl"></i>
          <div>
            <p class="font-bold">❌ Erreur de restauration</p>
            <p class="text-sm opacity-90">Impossible de restaurer l'idée. Vérifiez la console.</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
    }
  }

  function openPermanentDeleteModal(ideaId: string, idea: any) {
    setPermanentDeleteData({ ideaId, idea });
    setShowPermanentDeleteModal(true);
  }

  async function confirmPermanentDelete() {
    if (!permanentDeleteData) return;
    
    console.log('🗑️ Début suppression définitive idée:', permanentDeleteData);
    
    const success = await adminService.permanentDeleteIdea(permanentDeleteData.ideaId);
    
    console.log('🔍 Résultat suppression définitive:', success);
    
    if (success) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-trash-fill text-2xl"></i>
          <div>
            <p class="font-bold">🗑️ Idée supprimée définitivement</p>
            <p class="text-sm opacity-90">L'idée a été supprimée de la base de données</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      await loadDeletedIdeas();
    } else {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-exclamation-triangle-fill text-2xl"></i>
          <div>
            <p class="font-bold">❌ Erreur de suppression</p>
            <p class="text-sm opacity-90">Impossible de supprimer l'idée. Vérifiez la console.</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
    }
    
    setShowPermanentDeleteModal(false);
    setPermanentDeleteData(null);
  }

  const filteredIdeas = filter === 'all' ? ideas : ideas.filter(i => i.status === filter);
  const displayIdeas = tab === 'active' ? filteredIdeas : deletedIdeas;

  if (loading) {
    return <div className="text-center py-12"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="bi bi-lightbulb-fill text-primary"></i>
          Boîte à Idées
          <span className="text-sm font-normal text-white/60 ml-2">({displayIdeas.length} idées)</span>
        </h2>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              tab === 'active'
                ? 'bg-primary text-white shadow-neon-orange'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <i className="bi bi-lightbulb mr-2"></i>
            Actives ({ideas.length})
          </button>
          <button
            onClick={() => setTab('deleted')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              tab === 'deleted'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <i className="bi bi-trash mr-2"></i>
            Supprimées ({deletedIdeas.length})
          </button>
        </div>

        {tab === 'active' && (
          <div className="flex gap-2">
            {['all', 'pending', 'reviewed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filter === f
                    ? 'bg-primary text-white shadow-neon-orange'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {f === 'all' ? 'Toutes' : f === 'pending' ? 'En attente' : 'Examinées'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {displayIdeas.map((idea) => (
          <div key={idea.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all">
            <div className="flex items-start gap-4">
              {idea.user?.photo_url ? (
                <img src={idea.user.photo_url} alt={idea.user.prenom} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold">
                  {idea.user?.avatar}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{idea.user?.prenom} {idea.user?.nom}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    idea.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {idea.status === 'pending' ? 'En attente' : 'Examinée'}
                  </span>
                </div>
                
                <p className="text-white/60 text-sm mb-2">
                  Envoyée le {new Date(idea.created_at).toLocaleDateString('fr-FR')} à {new Date(idea.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>

                <div className="mb-4">
                  <p className="text-white">{idea.content}</p>
                </div>

                {idea.admin_notes && (
                  <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/60 text-xs mb-1">Note admin</p>
                    <p className="text-white text-sm">{idea.admin_notes}</p>
                  </div>
                )}

                {tab === 'active' && (
                  <>
                    {idea.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openActionModal(idea.id, 'reviewed', idea)}
                          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all"
                        >
                          <i className="bi bi-eye mr-2"></i>
                          Examiner
                        </button>
                        <button
                          onClick={() => openDeleteModal(idea.id, idea)}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-all ml-auto"
                        >
                          <i className="bi bi-trash mr-2"></i>
                          Supprimer
                        </button>
                      </div>
                    )}

                    {idea.status !== 'pending' && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => openDeleteModal(idea.id, idea)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/60 rounded-lg text-sm transition-all"
                        >
                          <i className="bi bi-trash mr-2"></i>
                          Supprimer
                        </button>
                      </div>
                    )}
                  </>
                )}

                {tab === 'deleted' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(idea.id)}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-all"
                    >
                      <i className="bi bi-arrow-counterclockwise mr-2"></i>
                      Restaurer
                    </button>
                    <button
                      onClick={() => openPermanentDeleteModal(idea.id, idea)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-all ml-auto"
                    >
                      <i className="bi bi-trash-fill mr-2"></i>
                      Supprimer définitivement
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {displayIdeas.length === 0 && (
          <div className="text-center py-12">
            <i className="bi bi-inbox text-6xl text-white/20 mb-4 block"></i>
            <p className="text-white/60">{tab === 'active' ? 'Aucune idée active' : 'Aucune idée supprimée'}</p>
          </div>
        )}
      </div>

      {/* Modal d'action */}
      {showActionModal && actionData && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setShowActionModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-border rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-500/10">
                  <i className="bi text-3xl bi-eye text-blue-400"></i>
                </div>
              </div>

              <h2 className="text-xl font-800 text-foreground text-center mb-3">
                Examiner cette idée ?
              </h2>
              
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {actionData.idea.user?.photo_url ? (
                    <img src={actionData.idea.user.photo_url} alt={actionData.idea.user.prenom} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold text-sm">
                      {actionData.idea.user?.avatar}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-sm">{actionData.idea.user?.prenom} {actionData.idea.user?.nom}</p>
                    <p className="text-white/60 text-xs">{new Date(actionData.idea.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm">{actionData.idea.content}</p>
              </div>

              <div className="mb-4">
                <label className="block text-white/80 text-sm mb-2">
                  Note (optionnel)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary resize-none"
                  rows={3}
                  placeholder="Ajoutez une note pour l'utilisateur..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-600 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmAction}
                  className="flex-1 py-3 px-4 rounded-xl font-600 transition-all bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Examiner
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && deleteData && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-red-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-red-500/20 animate-slide-up">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/10">
                  <i className="bi bi-trash text-3xl text-red-400"></i>
                </div>
              </div>

              <h2 className="text-xl font-800 text-foreground text-center mb-3">
                Supprimer cette idée ?
              </h2>
              
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {deleteData.idea.user?.photo_url ? (
                    <img src={deleteData.idea.user.photo_url} alt={deleteData.idea.user.prenom} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold text-sm">
                      {deleteData.idea.user?.avatar}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-sm">{deleteData.idea.user?.prenom} {deleteData.idea.user?.nom}</p>
                    <p className="text-white/60 text-xs">{new Date(deleteData.idea.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm">{deleteData.idea.content}</p>
              </div>

              <p className="text-white/60 text-sm text-center mb-6">
                L'idée sera déplacée dans la corbeille. Vous pourrez la restaurer plus tard.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-600 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 rounded-xl font-600 transition-all bg-red-500 hover:bg-red-600 text-white"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de suppression définitive */}
      {showPermanentDeleteModal && permanentDeleteData && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setShowPermanentDeleteModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-red-600/70 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-red-600/30 animate-slide-up">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-600/20 animate-pulse">
                  <i className="bi bi-exclamation-triangle-fill text-3xl text-red-500"></i>
                </div>
              </div>

              <h2 className="text-xl font-800 text-foreground text-center mb-3">
                ⚠️ Suppression définitive
              </h2>
              
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {permanentDeleteData.idea.user?.photo_url ? (
                    <img src={permanentDeleteData.idea.user.photo_url} alt={permanentDeleteData.idea.user.prenom} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold text-sm">
                      {permanentDeleteData.idea.user?.avatar}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-sm">{permanentDeleteData.idea.user?.prenom} {permanentDeleteData.idea.user?.nom}</p>
                    <p className="text-white/60 text-xs">{new Date(permanentDeleteData.idea.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm">{permanentDeleteData.idea.content}</p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="bi bi-exclamation-octagon-fill text-red-500 text-xl flex-shrink-0 mt-0.5"></i>
                  <div className="text-sm text-white/90 leading-relaxed">
                    <p className="font-bold text-red-400 mb-1">Action irréversible !</p>
                    <p>Cette idée sera <span className="font-bold text-red-400">définitivement supprimée</span> de la base de données. Vous ne pourrez plus la récupérer.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPermanentDeleteModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-600 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmPermanentDelete}
                  className="flex-1 py-3 px-4 rounded-xl font-600 transition-all bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30"
                >
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
