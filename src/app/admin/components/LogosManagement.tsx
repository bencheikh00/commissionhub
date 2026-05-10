'use client';

import { useEffect, useState } from 'react';
import { logoService } from '@/lib/supabase';

export default function LogosManagement({ currentUserId }: { currentUserId: string }) {
  const [logos, setLogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newLogo, setNewLogo] = useState({ name: '', description: '', category: 'official', file: null as File | null });

  useEffect(() => {
    loadLogos();
  }, []);

  async function loadLogos() {
    const data = await logoService.getAllLogos();
    setLogos(data);
    setLoading(false);
  }

  async function handleUpload() {
    if (!newLogo.file || !newLogo.name) return;
    
    setUploading(true);
    const result = await logoService.uploadLogo(newLogo.file, {
      name: newLogo.name,
      description: newLogo.description,
      category: newLogo.category as any,
      uploadedBy: currentUserId,
    });

    if (result) {
      await loadLogos();
      setShowUploadModal(false);
      setNewLogo({ name: '', description: '', category: 'official', file: null });
    }
    setUploading(false);
  }

  async function handleDelete(logoId: string) {
    if (!confirm('Supprimer ce logo ?')) return;
    const success = await logoService.deleteLogo(logoId);
    if (success) await loadLogos();
  }

  if (loading) {
    return <div className="text-center py-12"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="bi bi-image-fill text-primary"></i>
          Gestion des Logos
          <span className="text-sm font-normal text-white/60 ml-2">({logos.length} fichiers)</span>
        </h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-red-500 text-white rounded-lg font-semibold hover:shadow-neon-orange transition-all"
        >
          <i className="bi bi-cloud-upload mr-2"></i>
          Uploader un logo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {logos.map((logo) => (
          <div key={logo.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all">
            <div className="aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              <img src={logo.file_url} alt={logo.name} className="max-w-full max-h-full object-contain" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">{logo.name}</h3>
            {logo.description && <p className="text-sm text-white/60 mb-3">{logo.description}</p>}
            
            <div className="flex items-center justify-between text-xs text-white/60 mb-4">
              <span className="px-2 py-1 bg-white/10 rounded">{logo.category}</span>
              <span>{logo.file_type.toUpperCase()}</span>
              <span>{(logo.file_size / 1024).toFixed(0)} KB</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">
                <i className="bi bi-download mr-1"></i>
                {logo.downloads_count} téléchargements
              </span>
              <button
                onClick={() => handleDelete(logo.id)}
                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition-all"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Uploader un nouveau logo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Nom du logo *</label>
                <input
                  type="text"
                  value={newLogo.name}
                  onChange={(e) => setNewLogo({ ...newLogo, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Logo officiel IAM"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Description</label>
                <textarea
                  value={newLogo.description}
                  onChange={(e) => setNewLogo({ ...newLogo, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  rows={3}
                  placeholder="Description du logo..."
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Catégorie</label>
                <select
                  value={newLogo.category}
                  onChange={(e) => setNewLogo({ ...newLogo, category: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  <option value="official">Officiel</option>
                  <option value="event">Événement</option>
                  <option value="social">Réseaux sociaux</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Fichier *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewLogo({ ...newLogo, file: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpload}
                  disabled={uploading || !newLogo.file || !newLogo.name}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-red-500 text-white rounded-lg font-semibold hover:shadow-neon-orange transition-all disabled:opacity-50"
                >
                  {uploading ? 'Upload en cours...' : 'Uploader'}
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
