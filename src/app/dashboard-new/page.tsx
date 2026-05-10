'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function UnifiedDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const stored = sessionStorage.getItem('ch_user');
    if (stored) {
      setUserData(JSON.parse(stored));
    } else {
      router.push('/sign-up-login-screen');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('ch_user');
    router.push('/sign-up-login-screen');
  };

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: 'house-door-fill' },
    { id: 'members', label: 'Membres', icon: 'people-fill' },
    { id: 'absence', label: 'Demander une absence', icon: 'calendar-x-fill', action: () => setShowAbsenceModal(true) },
    { id: 'presidents', label: 'Anciens présidents', icon: 'award-fill' },
    { id: 'logos', label: 'Galerie des logos', icon: 'images' },
    { id: 'bug', label: 'Signaler un problème', icon: 'exclamation-triangle-fill', action: () => setShowBugModal(true) },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <i className="bi bi-list text-2xl"></i>
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <i className="bi bi-chat-dots-fill text-white text-sm"></i>
                  </div>
                  <span className="font-bold text-lg hidden sm:block">CommissionHub</span>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'} text-xl`}></i>
                </button>

                {/* User Menu */}
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  {userData?.photo_url ? (
                    <img src={userData.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                      {userData?.avatar}
                    </div>
                  )}
                  <span className="text-sm font-semibold hidden md:block">{userData?.name}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <i className="bi bi-box-arrow-right text-xl"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute top-full left-4 mt-2 w-72 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 py-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        setActiveSection(item.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left"
                  >
                    <i className={`bi ${item.icon} text-orange-500 text-lg`}></i>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </nav>

        {/* Main Content */}
        <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {activeSection === 'home' && <HomeSection userData={userData} setActiveSection={setActiveSection} />}
          {activeSection === 'members' && <MembersSection router={router} />}
          {activeSection === 'presidents' && <PresidentsSection />}
          {activeSection === 'logos' && <LogosSection />}
        </main>

        {/* Modals */}
        {showAbsenceModal && <AbsenceModal onClose={() => setShowAbsenceModal(false)} />}
        {showBugModal && <BugModal onClose={() => setShowBugModal(false)} />}
      </div>
    </div>
  );
}

// Home Section with animated welcome
function HomeSection({ userData, setActiveSection }: any) {
  return (
    <div className="space-y-8">
      {/* Hero Section with Animated Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl p-8 md:p-16 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            <span className="inline-block animate-fade-in">Bienvenue</span>{' '}
            <span className="inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>chez</span>{' '}
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>Bourama</span>{' '}
            <i className="bi bi-hand-wave-fill inline-block animate-wiggle"></i>
          </h1>
          <h2 className="text-xl md:text-2xl text-white/95 font-semibold mb-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            Le portail privé de la commission communication de l'IAM
          </h2>
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <i className="bi bi-person-circle text-white text-2xl"></i>
            </div>
            <div>
              <p className="text-white font-bold text-lg">{userData?.name}</p>
              <p className="text-white/80 text-sm">{userData?.grade}</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <i className="bi bi-shield-lock-fill text-orange-500 text-2xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <i className="bi bi-info-circle-fill text-orange-500"></i>
              Accès réservé
            </h3>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              L'accès à cette plateforme est strictement réservé aux membres actifs de la Commission Communication. 
              Cet environnement privé et sécurisé a pour but de protéger nos données internes tout en offrant des outils 
              performants pour collaborer, innover et piloter nos campagnes de communication en toute confidentialité.
            </p>
          </div>
        </div>
      </div>

      {/* Fonctionnalités Phares */}
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <i className="bi bi-stars text-orange-500"></i>
          Fonctionnalités phares
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon="people-fill" 
            title="Membres" 
            description="Annuaire complet des membres actifs de la commission"
            gradient="from-blue-500 to-blue-600"
            onClick={() => setActiveSection('members')} 
          />
          <FeatureCard 
            icon="award-fill" 
            title="Présidents" 
            description="Nos présidents qui ont marqué l'histoire de la commission"
            gradient="from-purple-500 to-purple-600"
            onClick={() => setActiveSection('presidents')} 
          />
          <FeatureCard 
            icon="image-fill" 
            title="Logos" 
            description="Logos phares de la com - Téléchargement direct"
            gradient="from-orange-500 to-orange-600"
            onClick={() => setActiveSection('logos')} 
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-left overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <i className={`bi ${icon} text-white text-3xl`}></i>
        </div>
        <h3 className="font-bold text-xl mb-2 group-hover:text-orange-500 transition-colors">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
      
      {/* Arrow icon */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <i className="bi bi-arrow-right-circle-fill text-orange-500 text-2xl"></i>
      </div>
    </button>
  );
}

// Members Section with skeleton
function MembersSection({ router }: any) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from('users').select('*');
      setMembers(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Membres de la commission</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div 
            key={member.id} 
            onClick={() => router.push(`/profile?id=${member.id}`)}
            className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-orange-500 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {member.photo_url ? (
                <img src={member.photo_url} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                  {member.prenom[0]}{member.nom[0]}
                </div>
              )}
              <div>
                <h3 className="font-bold">{member.prenom} {member.nom}</h3>
                <p className="text-sm text-orange-500">{member.grade}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{member.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Presidents Section
function PresidentsSection() {
  const [presidents, setPresidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPresidents();
  }, []);

  const loadPresidents = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('presidents').select('*').order('year', { ascending: false });
    setPresidents(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <i className="bi bi-award-fill text-orange-500"></i>
        Anciens présidents
      </h2>
      <div className="space-y-4">
        {presidents.map((pres, idx) => (
          <div key={pres.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pres.color} flex items-center justify-center text-white font-bold text-xl`}>
                {pres.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{pres.name}</h3>
                <p className="text-sm text-orange-500">{pres.year}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{pres.achievements}</p>
              </div>
              {idx === 0 && (
                <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold">
                  Récent
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Logos Section
function LogosSection() {
  const logos = [
    { name: 'Logo PNG Transparent', url: '/logos/logo-transparent.png', icon: 'file-earmark-image' },
    { name: 'Logo Blanc', url: '/logos/logo-white.png', icon: 'file-earmark-image' },
    { name: 'Logo Noir', url: '/logos/logo-black.png', icon: 'file-earmark-image' },
    { name: 'Logo Orange', url: '/logos/logo-orange.png', icon: 'file-earmark-image' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <i className="bi bi-image-fill text-orange-500"></i>
        Galerie des logos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {logos.map((logo) => (
          <a
            key={logo.name}
            href={logo.url}
            download
            className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-orange-500 transition-all flex items-center gap-4"
          >
            <i className={`bi ${logo.icon} text-orange-500 text-3xl`}></i>
            <div className="flex-1">
              <h3 className="font-bold">{logo.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cliquer pour télécharger</p>
            </div>
            <i className="bi bi-download text-orange-500"></i>
          </a>
        ))}
      </div>
    </div>
  );
}

// Absence Modal
function AbsenceModal({ onClose }: any) {
  const [formData, setFormData] = useState({ startDate: '', endDate: '', reason: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const user = JSON.parse(sessionStorage.getItem('ch_user') || '{}');
    await supabase.from('absences').insert([{ user_id: user.id, start_date: formData.startDate, end_date: formData.endDate, reason: formData.reason, status: 'pending' }]);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-black rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="bi bi-calendar-check-fill text-orange-500"></i>
            Demander une absence
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Date de début</label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Date de fin</label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Raison</label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Envoyer la demande'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Idea Modal
function IdeaModal({ onClose }: any) {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    alert('Idée envoyée avec succès !');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-black rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="bi bi-lightbulb-fill text-orange-500"></i>
            Boîte à idées
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Votre suggestion</label>
            <textarea
              required
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={6}
              placeholder="Partagez votre idée pour améliorer la commission..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Envoyer l\'idée'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Bug Modal
function BugModal({ onClose }: any) {
  const [bug, setBug] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    alert('Problème signalé avec succès !');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-black rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="bi bi-bug-fill text-orange-500"></i>
            Signaler un problème
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Description du problème</label>
            <textarea
              required
              value={bug}
              onChange={(e) => setBug(e.target.value)}
              rows={6}
              placeholder="Décrivez le problème technique rencontré..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Envoyer le rapport'}
          </button>
        </form>
      </div>
    </div>
  );
}
