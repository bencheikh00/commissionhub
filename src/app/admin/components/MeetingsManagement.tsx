'use client';

import { useEffect, useState } from 'react';
import { meetingService } from '@/lib/supabase';

export default function MeetingsManagement({ currentUserId }: { currentUserId: string }) {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<any>(null);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meeting_date: '',
    location: '',
    agenda: [''],
  });

  useEffect(() => {
    loadMeetings();
  }, []);

  async function loadMeetings() {
    const data = await meetingService.getAllMeetings();
    setMeetings(data);
    setLoading(false);
  }

  async function handleSubmit() {
    try {
      const meetingData = {
        ...formData,
        agenda: formData.agenda.filter(item => item.trim() !== ''),
        created_by: currentUserId,
      };

      console.log('📝 Données réunion:', meetingData);

      let result;
      if (editingMeeting) {
        result = await meetingService.updateMeeting(editingMeeting.id, meetingData);
      } else {
        result = await meetingService.createMeeting(meetingData);
      }

      console.log('✅ Résultat:', result);

      if (result) {
        // Notification de succès
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
        notification.innerHTML = `
          <div class="flex items-center gap-3">
            <i class="bi bi-check-circle-fill text-2xl"></i>
            <div>
              <p class="font-bold">✅ Réunion ${editingMeeting ? 'mise à jour' : 'créée'}</p>
              <p class="text-sm opacity-90">Tous les membres ont été notifiés</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
        
        await loadMeetings();
        resetForm();
      } else {
        alert('❌ Erreur lors de la création de la réunion');
      }
    } catch (error: any) {
      console.error('❌ Erreur complète:', error);
      console.error('❌ Type:', typeof error);
      console.error('❌ Keys:', Object.keys(error));
      console.error('❌ Message:', error?.message);
      console.error('❌ Code:', error?.code);
      alert(`Erreur: ${error?.message || error?.code || 'Erreur inconnue'}`);
    }
  }

  function confirmDelete(meeting: any) {
    setMeetingToDelete(meeting);
    setShowDeleteModal(true);
  }

  async function handleDelete() {
    if (!meetingToDelete) return;
    
    console.log('🗑️ Début suppression réunion:', meetingToDelete);
    
    const success = await meetingService.deleteMeeting(meetingToDelete.id);
    
    console.log('🔍 Résultat suppression:', success);
    
    if (success) {
      // Notification de succès
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-trash-fill text-2xl"></i>
          <div>
            <p class="font-bold">🗑️ Réunion supprimée</p>
            <p class="text-sm opacity-90">La réunion a été supprimée de la base de données</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      await loadMeetings();
    } else {
      // Notification d'erreur
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="bi bi-exclamation-triangle-fill text-2xl"></i>
          <div>
            <p class="font-bold">❌ Erreur de suppression</p>
            <p class="text-sm opacity-90">Impossible de supprimer la réunion. Vérifiez la console.</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
    }
    
    setShowDeleteModal(false);
    setMeetingToDelete(null);
  }

  function resetForm() {
    setFormData({ title: '', description: '', meeting_date: '', location: '', agenda: [''] });
    setEditingMeeting(null);
    setShowModal(false);
  }

  function handleEdit(meeting: any) {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description || '',
      meeting_date: new Date(meeting.meeting_date).toISOString().slice(0, 16),
      location: meeting.location || '',
      agenda: meeting.agenda || [''],
    });
    setShowModal(true);
  }

  function addAgendaItem() {
    setFormData({ ...formData, agenda: [...formData.agenda, ''] });
  }

  function updateAgendaItem(index: number, value: string) {
    const newAgenda = [...formData.agenda];
    newAgenda[index] = value;
    setFormData({ ...formData, agenda: newAgenda });
  }

  function removeAgendaItem(index: number) {
    setFormData({ ...formData, agenda: formData.agenda.filter((_, i) => i !== index) });
  }

  if (loading) {
    return <div className="text-center py-12"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="bi bi-calendar-event text-primary"></i>
          Gestion des Réunions
          <span className="text-sm font-normal text-white/60 ml-2">({meetings.length} réunions)</span>
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-red-500 text-white rounded-lg font-semibold hover:shadow-neon-orange transition-all"
        >
          <i className="bi bi-plus-circle mr-2"></i>
          Créer une réunion
        </button>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{meeting.title}</h3>
                {meeting.description && <p className="text-white/60 mb-3">{meeting.description}</p>}
              </div>
              <span className={`px-3 py-1 rounded text-xs font-semibold ${
                meeting.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                meeting.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                meeting.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {meeting.status === 'scheduled' ? 'Planifiée' : meeting.status === 'ongoing' ? 'En cours' : meeting.status === 'completed' ? 'Terminée' : 'Annulée'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-white/80">
                <i className="bi bi-calendar3 text-primary"></i>
                <span>{new Date(meeting.meeting_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <i className="bi bi-clock text-primary"></i>
                <span>{new Date(meeting.meeting_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {meeting.location && (
                <div className="flex items-center gap-2 text-white/80 col-span-2">
                  <i className="bi bi-geo-alt text-primary"></i>
                  <span>{meeting.location}</span>
                </div>
              )}
            </div>

            {meeting.agenda && meeting.agenda.length > 0 && (
              <div className="mb-4">
                <p className="text-white/60 text-sm mb-2">Ordre du jour :</p>
                <ul className="space-y-1">
                  {meeting.agenda.map((item: string, index: number) => (
                    <li key={index} className="text-white text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(meeting)}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all"
              >
                <i className="bi bi-pencil mr-2"></i>
                Modifier
              </button>
              <button
                onClick={() => confirmDelete(meeting)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-all"
              >
                <i className="bi bi-trash mr-2"></i>
                Supprimer
              </button>
            </div>
          </div>
        ))}

        {meetings.length === 0 && (
          <div className="text-center py-12">
            <i className="bi bi-calendar-x text-6xl text-white/20 mb-4 block"></i>
            <p className="text-white/60">Aucune réunion programmée</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-8 max-w-2xl w-full my-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingMeeting ? 'Modifier la réunion' : 'Créer une nouvelle réunion'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Réunion mensuelle"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  rows={3}
                  placeholder="Description de la réunion..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Date et heure *</label>
                  <input
                    type="datetime-local"
                    value={formData.meeting_date}
                    onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Lieu</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                    placeholder="Salle de réunion"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Ordre du jour</label>
                <div className="space-y-2">
                  {formData.agenda.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateAgendaItem(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                        placeholder={`Point ${index + 1}`}
                      />
                      {formData.agenda.length > 1 && (
                        <button
                          onClick={() => removeAgendaItem(index)}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addAgendaItem}
                    className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all"
                  >
                    <i className="bi bi-plus-circle mr-2"></i>
                    Ajouter un point
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!formData.title || !formData.meeting_date}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-red-500 text-white rounded-lg font-semibold hover:shadow-neon-orange transition-all disabled:opacity-50"
                >
                  {editingMeeting ? 'Mettre à jour' : 'Créer et notifier'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && meetingToDelete && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-red-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-red-500/20 animate-slide-up">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/10">
                  <i className="bi bi-calendar-x text-3xl text-red-400"></i>
                </div>
              </div>

              <h2 className="text-xl font-800 text-foreground text-center mb-3">
                Supprimer cette réunion ?
              </h2>
              
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <h3 className="text-white font-bold text-lg mb-2">{meetingToDelete.title}</h3>
                {meetingToDelete.description && (
                  <p className="text-white/60 text-sm mb-3">{meetingToDelete.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/80">
                    <i className="bi bi-calendar3 text-primary"></i>
                    <span>{new Date(meetingToDelete.meeting_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <i className="bi bi-clock text-primary"></i>
                    <span>{new Date(meetingToDelete.meeting_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                {meetingToDelete.location && (
                  <div className="flex items-center gap-2 text-white/80 text-sm mt-2">
                    <i className="bi bi-geo-alt text-primary"></i>
                    <span>{meetingToDelete.location}</span>
                  </div>
                )}
              </div>

              <p className="text-white/60 text-sm text-center mb-6">
                <span className="text-red-400 font-bold">⚠️ Cette action est irréversible.</span><br/>
                La réunion sera définitivement supprimée de la base de données.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-600 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
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
