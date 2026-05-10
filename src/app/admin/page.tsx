'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import AdminDashboard from './components/AdminDashboard';
import UsersManagement from './components/UsersManagement';
import LogosManagement from './components/LogosManagement';
import AbsencesManagement from './components/AbsencesManagement';
import IdeasManagement from './components/IdeasManagement';
import MeetingsManagement from './components/MeetingsManagement';
import TicketsManagement from './components/TicketsManagement';

type AdminSection = 'dashboard' | 'users' | 'logos' | 'absences' | 'ideas' | 'meetings' | 'tickets';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    try {
      // Récupérer l'utilisateur connecté depuis sessionStorage
      const userStr = sessionStorage.getItem('ch_user');
      
      if (!userStr) {
        console.log('❌ Pas de sessionStorage');
        router.push('/');
        return;
      }

      const currentUserData = JSON.parse(userStr);
      console.log('👤 Utilisateur sessionStorage:', currentUserData);

      // Vérifier le rôle dans la base de données
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUserData.id)
        .single();

      console.log('📊 Données DB:', userData);
      console.log('🔐 Rôle:', userData?.role);

      if (error) {
        console.error('❌ Erreur DB:', error);
        router.push('/');
        return;
      }

      if (!userData || userData.role !== 'Admin') {
        console.log('❌ Access denied: role =', userData?.role);
        alert('Accès refusé : Vous devez être administrateur');
        router.push('/dashboard');
        return;
      }

      console.log('✅ Admin access granted!');
      setCurrentUser(userData);
      setIsAdmin(true);
    } catch (error) {
      console.error('❌ Error checking admin access:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-500 rounded-lg flex items-center justify-center shadow-neon-orange">
                <i className="bi bi-shield-lock-fill text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Back-Office Admin</h1>
                <p className="text-xs text-white/60">Contrôle total de la plateforme</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{currentUser?.prenom} {currentUser?.nom}</p>
                <p className="text-xs text-primary">{currentUser?.grade}</p>
              </div>
              {currentUser?.photo_url ? (
                <img src={currentUser.photo_url} alt="Admin" className="w-10 h-10 rounded-full border-2 border-primary shadow-neon-orange" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold border-2 border-primary shadow-neon-orange">
                  {currentUser?.avatar}
                </div>
              )}
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm"
              >
                <i className="bi bi-box-arrow-left mr-2"></i>
                Retour
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
          {[
            { id: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard', color: 'orange' },
            { id: 'users', icon: 'bi-people-fill', label: 'Utilisateurs', color: 'blue' },
            { id: 'logos', icon: 'bi-image-fill', label: 'Logos', color: 'purple' },
            { id: 'absences', icon: 'bi-calendar-x', label: 'Absences', color: 'green' },
            { id: 'ideas', icon: 'bi-lightbulb-fill', label: 'Boîte à idées', color: 'yellow' },
            { id: 'meetings', icon: 'bi-calendar-event', label: 'Réunions', color: 'cyan' },
            { id: 'tickets', icon: 'bi-flag-fill', label: 'Tickets', color: 'red' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as AdminSection)}
              className={`p-4 rounded-xl border transition-all ${
                activeSection === section.id
                  ? 'bg-primary/20 border-primary shadow-neon-orange'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <i className={`${section.icon} text-2xl ${activeSection === section.id ? 'text-primary' : 'text-white/60'} mb-2 block`}></i>
              <p className={`text-sm font-semibold ${activeSection === section.id ? 'text-white' : 'text-white/60'}`}>
                {section.label}
              </p>
            </button>
          ))}
        </div>

        <div className="min-h-[600px]">
          {activeSection === 'dashboard' && <AdminDashboard />}
          {activeSection === 'users' && <UsersManagement currentUserId={currentUser?.id} />}
          {activeSection === 'logos' && <LogosManagement currentUserId={currentUser?.id} />}
          {activeSection === 'absences' && <AbsencesManagement currentUserId={currentUser?.id} />}
          {activeSection === 'ideas' && <IdeasManagement currentUserId={currentUser?.id} />}
          {activeSection === 'meetings' && <MeetingsManagement currentUserId={currentUser?.id} />}
          {activeSection === 'tickets' && <TicketsManagement currentUserId={currentUser?.id} />}
        </div>
      </div>

      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/40 text-sm">
            © 2026 Commission Communication IAM | Keur Bourama
          </p>
          <p className="text-white/30 text-xs mt-1">
            Développé avec 🧡 par <span className="font-semibold text-primary/80">SBCS</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
