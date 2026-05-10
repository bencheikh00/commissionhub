'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/lib/supabase';

const GRADES = [
  'Alpha',
  'Gamma', 
  'Kappa',
  'Delta',
  'Oméga',
  'Haut communicant',
  'Très haut communicant',
  'Plus'
] as const;

export default function UsersManagement({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const data = await adminService.getAllUsers();
    setUsers(data);
    setLoading(false);
  }

  async function handleUpdateUser(userId: string, updates: any) {
    const success = await adminService.updateUser(userId, updates);
    if (success) {
      // Notification de succès
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-check-circle-fill text-2xl"></i>
          <div>
            <p class="font-bold">✅ Utilisateur mis à jour</p>
            <p class="text-sm opacity-90">Les modifications ont été enregistrées</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      await loadUsers();
      setEditingUser(null);
    } else {
      alert('❌ Erreur lors de la mise à jour');
    }
  }

  async function handleDeleteUser(userId: string) {
    const success = await adminService.deleteUser(userId);
    if (success) {
      // Notification de succès
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-trash-fill text-2xl"></i>
          <div>
            <p class="font-bold">🗑️ Utilisateur supprimé</p>
            <p class="text-sm opacity-90">L'utilisateur a été définitivement supprimé</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
      
      await loadUsers();
    } else {
      alert('❌ Erreur lors de la suppression');
    }
    setShowDeleteModal(false);
    setUserToDelete(null);
  }

  function confirmDelete(user: any) {
    setUserToDelete(user);
    setShowDeleteModal(true);
  }

  const filteredUsers = users.filter(u =>
    u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="bi bi-people-fill text-primary"></i>
          Gestion des Utilisateurs
          <span className="text-sm font-normal text-white/60 ml-2">({users.length} membres)</span>
        </h2>
        <div className="relative">
          <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-white/40"></i>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all">
            <div className="flex items-start gap-4">
              {user.photo_url ? (
                <img src={user.photo_url} alt={user.prenom} className="w-16 h-16 rounded-full border-2 border-primary" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold text-xl">
                  {user.avatar}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{user.prenom} {user.nom}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'Admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {user.role}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'}`}></span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-white/60">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Grade</p>
                    <p className="text-white">{user.grade}</p>
                  </div>
                  {user.phone && (
                    <div>
                      <p className="text-white/60">Téléphone</p>
                      <p className="text-white">{user.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-white/60">Inscrit le</p>
                    <p className="text-white">{new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all"
                  >
                    <i className="bi bi-pencil mr-2"></i>
                    Modifier
                  </button>
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => confirmDelete(user)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-all"
                    >
                      <i className="bi bi-trash mr-2"></i>
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Modifier l'utilisateur</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Prénom</label>
                  <input
                    type="text"
                    value={editingUser.prenom}
                    onChange={(e) => setEditingUser({ ...editingUser, prenom: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Nom</label>
                  <input
                    type="text"
                    value={editingUser.nom}
                    onChange={(e) => setEditingUser({ ...editingUser, nom: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Grade</label>
                <select
                  value={editingUser.grade}
                  onChange={(e) => setEditingUser({ ...editingUser, grade: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  {GRADES.map((grade) => (
                    <option key={grade} value={grade} className="bg-gray-900">{grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Rôle</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleUpdateUser(editingUser.id, editingUser)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-red-500 text-white rounded-lg font-semibold hover:shadow-neon-orange transition-all"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && userToDelete && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-red-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                  <i className="bi bi-exclamation-triangle-fill text-3xl text-red-400"></i>
                </div>
              </div>

              <h2 className="text-xl font-800 text-foreground text-center mb-3">
                Supprimer cet utilisateur ?
              </h2>
              
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  {userToDelete.photo_url ? (
                    <img src={userToDelete.photo_url} alt={userToDelete.prenom} className="w-12 h-12 rounded-full" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold">
                      {userToDelete.avatar}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold">{userToDelete.prenom} {userToDelete.nom}</p>
                    <p className="text-white/60 text-sm">{userToDelete.email}</p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-center mb-6">
                <span className="text-red-400 font-bold">⚠️ Cette action est irréversible.</span><br/>
                Toutes les données de cet utilisateur seront définitivement supprimées.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-600 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteUser(userToDelete.id)}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-600 transition-all"
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
