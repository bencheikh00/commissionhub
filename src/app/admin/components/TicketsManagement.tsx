'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/lib/supabase';

export default function TicketsManagement({ currentUserId }: { currentUserId: string }) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('open');
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionData, setActionData] = useState<{ ticketId: string; action: 'in_progress' | 'resolved'; ticket: any } | null>(null);
  const [deleteData, setDeleteData] = useState<{ ticketId: string; ticket: any } | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadTickets();
    
    const interval = setInterval(loadTickets, 3000);
    return () => clearInterval(interval);
  }, []);

  async function loadTickets() {
    const data = await adminService.getAllTickets();
    setTickets(data);
    setLoading(false);
  }

  function openActionModal(ticketId: string, action: 'in_progress' | 'resolved', ticket: any) {
    setActionData({ ticketId, action, ticket });
    setAdminNotes('');
    setShowActionModal(true);
  }

  function openDeleteModal(ticketId: string, ticket: any) {
    setDeleteData({ ticketId, ticket });
    setShowDeleteModal(true);
  }

  async function confirmAction() {
    if (!actionData) return;
    
    console.log('🔄 Début action ticket:', actionData);
    
    const success = await adminService.updateTicketStatus(
      actionData.ticketId, 
      actionData.action,
      currentUserId
    );
    
    console.log('🔍 Résultat action:', success);
    
    if (success) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-check-circle-fill text-2xl"></i>
          <div>
            <p class="font-bold">✅ Ticket ${actionData.action === 'in_progress' ? 'en cours' : 'résolu'}</p>
            <p class="text-sm opacity-90">L'utilisateur sera notifié</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      await loadTickets();
    } else {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-exclamation-triangle-fill text-2xl"></i>
          <div>
            <p class="font-bold">❌ Erreur</p>
            <p class="text-sm opacity-90">Impossible de mettre à jour le ticket</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
    }
    
    setShowActionModal(false);
    setActionData(null);
    setAdminNotes('');
  }

  async function confirmDelete() {
    if (!deleteData) return;
    
    console.log('🗑️ Début suppression ticket:', deleteData);
    
    const success = await adminService.deleteTicket(deleteData.ticketId);
    
    console.log('🔍 Résultat suppression:', success);
    
    if (success) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-trash-fill text-2xl"></i>
          <div>
            <p class="font-bold">🗑️ Ticket supprimé</p>
            <p class="text-sm opacity-90">Le ticket a été supprimé de la base de données</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      await loadTickets();
    } else {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-exclamation-triangle-fill text-2xl"></i>
          <div>
            <p class="font-bold">❌ Erreur de suppression</p>
            <p class="text-sm opacity-90">Impossible de supprimer le ticket</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
    }
    
    setShowDeleteModal(false);
    setDeleteData(null);
  }

  const filteredTickets = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  if (loading) {
    return <div className="text-center py-12"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="bi bi-flag-fill text-primary"></i>
          Tickets de Support
          <span className="text-sm font-normal text-white/60 ml-2">({filteredTickets.length} tickets)</span>
        </h2>
        <div className="flex gap-2">
          {['all', 'open', 'in_progress', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                filter === f
                  ? 'bg-primary text-white shadow-neon-orange'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {f === 'all' ? 'Tous' : f === 'open' ? 'Ouverts' : f === 'in_progress' ? 'En cours' : 'Résolus'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all">
            <div className="flex items-start gap-4">
              {ticket.user?.photo_url ? (
                <img src={ticket.user.photo_url} alt={ticket.user.prenom} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold">
                  {ticket.user?.avatar}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{ticket.user?.prenom} {ticket.user?.nom}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                    ticket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {ticket.status === 'open' ? 'Ouvert' : ticket.status === 'in_progress' ? 'En cours' : 'Résolu'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    ticket.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    ticket.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {ticket.priority === 'high' ? 'Haute' : ticket.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                </div>
                
                <p className="text-white/60 text-sm mb-2">
                  Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')} à {new Date(ticket.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>

                <div className="mb-4">
                  <p className="text-white font-semibold mb-1">{ticket.subject}</p>
                  <p className="text-white/80 text-sm">{ticket.message}</p>
                </div>

                {ticket.status === 'open' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openActionModal(ticket.id, 'in_progress', ticket)}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all"
                    >
                      <i className="bi bi-hourglass-split mr-2"></i>
                      Prendre en charge
                    </button>
                    <button
                      onClick={() => openActionModal(ticket.id, 'resolved', ticket)}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-all"
                    >
                      <i className="bi bi-check-circle mr-2"></i>
                      Résoudre
                    </button>
                    <button
                      onClick={() => openDeleteModal(ticket.id, ticket)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-all ml-auto"
                    >
                      <i className="bi bi-trash mr-2"></i>
                      Supprimer
                    </button>
                  </div>
                )}

                {ticket.status === 'in_progress' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openActionModal(ticket.id, 'resolved', ticket)}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-all"
                    >
                      <i className="bi bi-check-circle mr-2"></i>
                      Marquer comme résolu
                    </button>
                    <button
                      onClick={() => openDeleteModal(ticket.id, ticket)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/60 rounded-lg text-sm transition-all ml-auto"
                    >
                      <i className="bi bi-trash mr-2"></i>
                      Supprimer
                    </button>
                  </div>
                )}

                {ticket.status === 'resolved' && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => openDeleteModal(ticket.id, ticket)}
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

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <i className="bi bi-inbox text-6xl text-white/20 mb-4 block"></i>
            <p className="text-white/60">Aucun ticket</p>
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
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  actionData.action === 'in_progress' ? 'bg-blue-500/10' : 'bg-green-500/10'
                }`}>
                  <i className={`bi text-3xl ${
                    actionData.action === 'in_progress' ? 'bi-hourglass-split text-blue-400' : 'bi-check-circle text-green-400'
                  }`}></i>
                </div>
              </div>

              <h2 className="text-xl font-800 text-foreground text-center mb-3">
                {actionData.action === 'in_progress' ? 'Prendre en charge ce ticket ?' : 'Marquer comme résolu ?'}
              </h2>
              
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {actionData.ticket.user?.photo_url ? (
                    <img src={actionData.ticket.user.photo_url} alt={actionData.ticket.user.prenom} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold text-sm">
                      {actionData.ticket.user?.avatar}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-sm">{actionData.ticket.user?.prenom} {actionData.ticket.user?.nom}</p>
                    <p className="text-white/60 text-xs">{new Date(actionData.ticket.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <p className="text-white font-semibold text-sm mb-1">{actionData.ticket.subject}</p>
                <p className="text-white/80 text-xs">{actionData.ticket.message}</p>
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
                  className={`flex-1 py-3 px-4 rounded-xl font-600 transition-all ${
                    actionData.action === 'in_progress' 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Confirmer
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
                Supprimer ce ticket ?
              </h2>
              
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {deleteData.ticket.user?.photo_url ? (
                    <img src={deleteData.ticket.user.photo_url} alt={deleteData.ticket.user.prenom} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold text-sm">
                      {deleteData.ticket.user?.avatar}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-sm">{deleteData.ticket.user?.prenom} {deleteData.ticket.user?.nom}</p>
                    <p className="text-white/60 text-xs">{new Date(deleteData.ticket.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <p className="text-white font-semibold text-sm mb-1">{deleteData.ticket.subject}</p>
                <p className="text-white/80 text-xs">{deleteData.ticket.message}</p>
              </div>

              <p className="text-white/60 text-sm text-center mb-6">
                <span className="text-red-400 font-bold">⚠️ Cette action est irréversible.</span><br/>
                Le ticket sera définitivement supprimé de la base de données.
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
