'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import { Menu, Bell, LogOut, Settings, ChevronDown, Users, Calendar, Crown, MessageSquare } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<{ name: string; grade: string; avatar: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
=======
import { userService, absenceService, ideaService, supportService, logoService } from '@/lib/supabase';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import ProfileView from './components/ProfileView';
import AboutSection from './components/AboutSection';
import MeetingsSection from './components/MeetingsSection';

type User = Database['public']['Tables']['users']['Row'];

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<{ id: string; name: string; grade: string; avatar: string; photo_url?: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'members' | 'absences' | 'presidents' | 'ideas' | 'logos' | 'support' | 'profile' | 'about' | 'meetings'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  // États pour les formulaires
  const [absenceForm, setAbsenceForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [ideaForm, setIdeaForm] = useState('');
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIdeaSuccessModal, setShowIdeaSuccessModal] = useState(false);
  const [showSupportSuccessModal, setShowSupportSuccessModal] = useState(false);

  // États pour les données réelles
  const [members, setMembers] = useState<User[]>([]);
  const [membersByGrade, setMembersByGrade] = useState<Record<string, User[]>>({});
  const [presidents, setPresidents] = useState<User[]>([]);
  const [logos, setLogos] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)

  useEffect(() => {
    const stored = sessionStorage.getItem('ch_user');
    if (stored) {
<<<<<<< HEAD
      setUserData(JSON.parse(stored));
    } else {
      router.push('/sign-up-login-screen');
    }
  }, [router]);

  const handleLogout = () => {
=======
      const parsed = JSON.parse(stored);
      setUserData({ 
        id: parsed.id,
        name: parsed.name, 
        grade: parsed.grade, 
        avatar: parsed.avatar,
        photo_url: parsed.photo_url
      });
      
      // Rafraîchir les données depuis la base de données
      refreshUserData(parsed.id);
    } else {
      router.push('/sign-up-login-screen');
      return;
    }
    
    setTimeout(() => setIsLoading(false), 800);
  }, [router]);

  // Fonction pour rafraîchir les données utilisateur depuis la DB
  const refreshUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        const updatedUser = {
          id: data.id,
          name: `${data.prenom} ${data.nom}`,
          grade: data.grade,
          avatar: data.avatar,
          photo_url: data.photo_url
        };
        
        // Mettre à jour sessionStorage
        sessionStorage.setItem('ch_user', JSON.stringify(updatedUser));
        
        // Mettre à jour l'état
        setUserData(updatedUser);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  // Charger les membres quand la section est activée
  useEffect(() => {
    if (activeSection === 'members' && members.length === 0) {
      loadMembers();
    }
  }, [activeSection]);

  // Charger les présidents quand la section est activée
  useEffect(() => {
    if (activeSection === 'presidents' && presidents.length === 0) {
      loadPresidents();
    }
  }, [activeSection]);

  // Charger les logos quand la section est activée
  useEffect(() => {
    if (activeSection === 'logos') {
      loadLogos();
    }
  }, [activeSection]);

  const loadMembers = async () => {
    setLoadingData(true);
    try {
      const grouped = await userService.getMembersByGrade();
      setMembersByGrade(grouped);
      const allMembers = Object.values(grouped).flat();
      setMembers(allMembers);
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
      alert('Erreur lors du chargement des membres');
    } finally {
      setLoadingData(false);
    }
  };

  const loadPresidents = async () => {
    setLoadingData(true);
    try {
      const data = await userService.getAllPresidents();
      setPresidents(data);
    } catch (error) {
      console.error('Erreur lors du chargement des présidents:', error);
      alert('Erreur lors du chargement des présidents');
    } finally {
      setLoadingData(false);
    }
  };

  const loadLogos = async () => {
    setLoadingData(true);
    try {
      const data = await logoService.getAllLogos();
      setLogos(data);
    } catch (error) {
      console.error('Erreur lors du chargement des logos:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
    sessionStorage.removeItem('ch_user');
    router.push('/sign-up-login-screen');
  };

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-card">
=======
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleMemberClick = (member: User) => {
    setSelectedMember(member);
    setActiveSection('profile');
  };

  const handleAbsenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.id) return;

    setIsSubmitting(true);
    try {
      await absenceService.createAbsence({
        userId: userData.id,
        startDate: absenceForm.startDate,
        endDate: absenceForm.endDate,
        reason: absenceForm.reason,
      });
      alert('✅ Demande d\'absence envoyée avec succès !');
      setAbsenceForm({ startDate: '', endDate: '', reason: '' });
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'envoi de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.id) return;

    setIsSubmitting(true);
    try {
      await ideaService.createIdea({
        userId: userData.id,
        content: ideaForm,
      });
      setShowIdeaSuccessModal(true);
      setIdeaForm('');
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'envoi de l\'idée');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.id) return;

    setIsSubmitting(true);
    try {
      await supportService.createTicket({
        userId: userData.id,
        subject: supportForm.subject,
        message: supportForm.message,
        priority: 'medium',
      });
      setShowSupportSuccessModal(true);
      setSupportForm({ subject: '', message: '' });
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'envoi du rapport');
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems = [
    { id: 'about', label: 'À propos', icon: 'bi-info-circle-fill' },
    { id: 'meetings', label: 'Réunions', icon: 'bi-calendar-event-fill' },
    { id: 'members', label: 'Membres', icon: 'bi-people-fill' },
    { id: 'absences', label: 'Demande d\'absence', icon: 'bi-calendar-check' },
    { id: 'presidents', label: 'Anciens présidents', icon: 'bi-trophy-fill' },
    { id: 'ideas', label: 'Boîte à idées', icon: 'bi-lightbulb-fill' },
    { id: 'logos', label: 'Galerie des logos', icon: 'bi-images' },
    { id: 'support', label: 'Signaler un problème', icon: 'bi-flag-fill' },
  ];

  if (isLoading) {
    return <LoadingSkeleton darkMode={darkMode} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
            onClick={cancelLogout}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-slide-up">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                  <i className="bi bi-box-arrow-right text-3xl text-red-400"></i>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-800 text-foreground text-center mb-3">
                Déconnexion
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Voulez-vous vraiment vous déconnecter ?
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-600 transition-all duration-200 hover:scale-105"
                >
                  Non, rester connecté
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-600 transition-all duration-200 hover:scale-105"
                >
                  Oui, me déconnecter
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-card sticky top-0 z-50">
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMainMenu(!showMainMenu)}
<<<<<<< HEAD
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150 relative"
            aria-label="Menu principal"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-orange flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 14 Q2 8 8 8 Q14 8 14 2" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <circle cx="2" cy="14" r="1.5" fill="#0A0A0A"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="font-700 text-foreground text-sm tracking-tight">CommissionHub</span>
              <span className="hidden md:inline text-muted-foreground text-xs ml-2">· Commission Communication</span>
=======
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
            aria-label="Menu principal"
          >
            <i className="bi bi-list text-xl"></i>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 bg-white">
              <img 
                src="/assets/images/app_logo.png" 
                alt="Logo Commission" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-700 text-foreground text-sm tracking-tight">Commission communication | Keur Bourama</span>
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
<<<<<<< HEAD
          <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150">
            <Bell size={18} />
=======
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
            aria-label="Toggle dark mode"
          >
            <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'} text-lg`}></i>
          </button>

          <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150">
            <i className="bi bi-bell-fill text-lg"></i>
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
<<<<<<< HEAD
              className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-xl hover:bg-muted transition-all duration-150 group"
            >
              <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center text-primary-foreground font-800 text-xs flex-shrink-0">
                {userData?.avatar || 'U'}
              </div>
=======
              className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-xl hover:bg-muted transition-all duration-150"
            >
              {userData?.photo_url ? (
                <img 
                  src={userData.photo_url} 
                  alt={userData.name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-primary/30 flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center text-primary-foreground font-800 text-xs flex-shrink-0">
                  {userData?.avatar || 'U'}
                </div>
              )}
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
              <div className="hidden md:block text-left">
                <p className="text-xs font-600 text-foreground leading-none">{userData?.name || 'Utilisateur'}</p>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">{userData?.grade || 'Membre'}</p>
              </div>
<<<<<<< HEAD
              <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
=======
              <i className={`bi bi-chevron-down text-xs text-muted-foreground transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}></i>
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1 animate-fade-in">
                <div className="px-3 py-2.5 border-b border-border">
                  <p className="text-xs font-600 text-foreground">{userData?.name || 'Utilisateur'}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{userData?.grade || 'Membre'}</p>
                </div>
                <button 
                  onClick={() => router.push('/profile')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
                >
<<<<<<< HEAD
                  <Settings size={14} />
=======
                  <i className="bi bi-gear-fill text-sm"></i>
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
                  Paramètres du profil
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-150"
                >
<<<<<<< HEAD
                  <LogOut size={14} />
=======
                  <i className="bi bi-box-arrow-right text-sm"></i>
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Menu Dropdown */}
        {showMainMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMainMenu(false)}
            />
            <div className="absolute left-4 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 py-2 animate-fade-in">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider">Navigation</p>
              </div>
<<<<<<< HEAD
              <button
                onClick={() => {
                  router.push('/members-screen');
                  setShowMainMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-all duration-150"
              >
                <Users size={16} className="text-primary" />
                Voir les membres
              </button>
              <button
                onClick={() => {
                  router.push('/chat-screen');
                  setShowMainMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-all duration-150"
              >
                <MessageSquare size={16} className="text-primary" />
                Chat messagerie
              </button>
              <button
                onClick={() => {
                  setShowMainMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-all duration-150"
              >
                <Calendar size={16} className="text-primary" />
                Demander une absence
              </button>
              <button
                onClick={() => {
                  router.push('/presidents-screen');
                  setShowMainMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-all duration-150"
              >
                <Crown size={16} className="text-primary" />
                Anciens présidents
              </button>
=======
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as any);
                    setShowMainMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150 ${
                    activeSection === item.id 
                      ? 'text-primary bg-primary/10' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <i className={`${item.icon} text-base`}></i>
                  {item.label}
                </button>
              ))}
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
            </div>
          </>
        )}
      </header>

      {/* Main Content */}
<<<<<<< HEAD
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div className="mb-8 p-8 rounded-2xl gradient-orange glow-orange-sm animate-fade-in">
          <h1 className="text-4xl font-800 text-primary-foreground mb-2 animate-slide-up">
            Bienvenue 👋
          </h1>
          <p className="text-lg text-primary-foreground/90 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {userData?.name || 'Utilisateur'}
          </p>
          <p className="text-sm text-primary-foreground/70 mt-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {userData?.grade || 'Membre'} · Commission Communication
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/members-screen')}
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users size={24} className="text-primary" />
            </div>
            <h3 className="font-700 text-foreground mb-1">Membres</h3>
            <p className="text-sm text-muted-foreground">Voir tous les membres</p>
          </button>

          <button
            onClick={() => router.push('/chat-screen')}
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare size={24} className="text-primary" />
            </div>
            <h3 className="font-700 text-foreground mb-1">Chat</h3>
            <p className="text-sm text-muted-foreground">Messagerie instantanée</p>
          </button>

          <button
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar size={24} className="text-primary" />
            </div>
            <h3 className="font-700 text-foreground mb-1">Absences</h3>
            <p className="text-sm text-muted-foreground">Demander une absence</p>
          </button>

          <button
            onClick={() => router.push('/presidents-screen')}
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Crown size={24} className="text-primary" />
            </div>
            <h3 className="font-700 text-foreground mb-1">Présidents</h3>
            <p className="text-sm text-muted-foreground">Historique des présidents</p>
          </button>
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Home Section */}
        {activeSection === 'home' && (
          <>
            {/* Welcome Hero Section */}
            <div className="mb-12">
              {/* Main Welcome Title - H1 with Animation */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-800 text-foreground mb-8 text-center">
                <span className="inline-block animate-fade-in">Bienvenue</span>{' '}
                <span className="inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>chez</span>{' '}
                <span className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  Bourama
                </span>
                <span className="inline-block animate-wave ml-3" style={{ animationDelay: '0.6s' }}>
                  <i className="bi bi-hand-wave-fill text-primary"></i>
                </span>
              </h1>

              {/* User Card */}
              <div className="max-w-md mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="p-6 rounded-2xl gradient-orange glow-orange-sm text-center">
                  <div className="flex items-center justify-center gap-4 mb-3">
                    {userData?.photo_url ? (
                      <img 
                        src={userData.photo_url} 
                        alt={userData.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-primary-foreground/20 shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground font-800 text-2xl shadow-lg">
                        {userData?.avatar || 'U'}
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-lg font-700 text-primary-foreground">{userData?.name || 'Utilisateur'}</p>
                      <p className="text-sm text-primary-foreground/80">{userData?.grade || 'Membre'} · Commission Communication</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice - En vogue */}
              <div className="max-w-4xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="relative p-8 md:p-10 rounded-2xl bg-card border-2 border-primary/20 shadow-2xl">
                  {/* Decorative Corners */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary rounded-tl-2xl opacity-40" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary rounded-tr-2xl opacity-40" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary rounded-bl-2xl opacity-40" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary rounded-br-2xl opacity-40" />

                  {/* Icon */}
                  <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <i className="bi bi-shield-lock-fill text-3xl text-primary"></i>
                    </div>
                  </div>

                  {/* Main Text */}
                  <p className="text-lg sm:text-xl leading-relaxed text-foreground font-500 text-center mb-6">
                    L'accès à cette plateforme est{' '}
                    <span className="font-800 text-primary">strictement réservé</span>{' '}
                    aux membres actifs de la{' '}
                    <span className="font-800 text-foreground">Commission Communication</span>.
                  </p>
                  
                  <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto my-6" />

                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-center">
                    Cet environnement privé et sécurisé a pour but de protéger nos données internes 
                    tout en offrant des outils performants pour{' '}
                    <span className="text-foreground font-700">collaborer</span>,{' '}
                    <span className="text-foreground font-700">innover</span> et{' '}
                    <span className="text-foreground font-700">piloter</span> nos campagnes de communication 
                    en toute confidentialité.
                  </p>

                  {/* Security Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                      <i className="bi bi-lock-fill text-sm text-primary"></i>
                      <span className="text-sm font-700 text-primary">Chiffré</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                      <i className="bi bi-shield-check text-sm text-primary"></i>
                      <span className="text-sm font-700 text-primary">Sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                      <i className="bi bi-eye-slash-fill text-sm text-primary"></i>
                      <span className="text-sm font-700 text-primary">Confidentiel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - Optimisé Mobile avec 3 par ligne */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className="neon-card p-3 rounded-lg bg-card border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 text-left group animate-fade-in hover:shadow-neon-orange"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform group-hover:shadow-neon-orange-sm">
                    <i className={`${item.icon} text-lg text-primary`}></i>
                  </div>
                  <h3 className="font-700 text-foreground mb-0.5 text-xs leading-tight">{item.label}</h3>
                  <p className="text-[10px] text-muted-foreground leading-tight line-clamp-1">Accéder</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Members Section */}
        {activeSection === 'members' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-800 text-foreground flex items-center gap-2">
                  <i className="bi bi-people-fill text-primary"></i>
                  Membres de la Commission
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {members.length} membre{members.length > 1 ? 's' : ''} actif{members.length > 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setActiveSection('home')}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>

            {loadingData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-card border border-border animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-12">
                <i className="bi bi-people text-6xl text-muted-foreground mb-4"></i>
                <p className="text-muted-foreground">Aucun membre trouvé</p>
                <p className="text-sm text-muted-foreground mt-2">Les nouveaux membres apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(membersByGrade).map(([grade, gradeMembers]) => (
                  <div key={grade} className="animate-fade-in">
                    {/* Grade Header - Style Néon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          grade === 'Président' ? 'bg-yellow-400/10 border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.3)]' :
                          grade === 'Responsable' || grade === 'Haut communicant' ? 'bg-blue-400/10 border-2 border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
                          grade === 'Adjoint' || grade === 'Gamma' ? 'bg-purple-400/10 border-2 border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' :
                          grade === 'Membre' || grade === 'Kappa' ? 'bg-green-400/10 border-2 border-green-400/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
                          'bg-gray-400/10 border-2 border-gray-400/30'
                        }`}>
                          <i className={`bi text-xl ${
                            grade === 'Président' ? 'bi-star-fill text-yellow-400' :
                            grade === 'Responsable' || grade === 'Haut communicant' ? 'bi-award-fill text-blue-400' :
                            grade === 'Adjoint' || grade === 'Gamma' ? 'bi-shield-fill text-purple-400' :
                            grade === 'Membre' || grade === 'Kappa' ? 'bi-person-fill text-green-400' :
                            'bi-person text-gray-400'
                          }`}></i>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-800 text-foreground">{grade}</h3>
                        <p className="text-sm text-muted-foreground">
                          {gradeMembers.length} membre{gradeMembers.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
                    </div>

                    {/* Members Grid - Design UX/UI Compact et Élégant */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                      {gradeMembers.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => handleMemberClick(member)}
                          className="group relative neon-card p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 text-center cursor-pointer hover:shadow-neon-orange overflow-hidden"
                        >
                          {/* Photo de profil */}
                          <div className="relative mx-auto mb-2">
                            {member.photo_url ? (
                              <img 
                                src={member.photo_url} 
                                alt={`${member.prenom} ${member.nom}`}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto border-2 border-primary/20 group-hover:border-primary/50 transition-all duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full gradient-orange flex items-center justify-center text-primary-foreground font-800 text-xl sm:text-2xl mx-auto border-2 border-primary/20 group-hover:border-primary/50 transition-all duration-300 group-hover:scale-105">
                                {member.avatar}
                              </div>
                            )}
                            {/* Status badge */}
                            <div className={`absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full border-2 border-card ${
                              member.status === 'online' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' :
                              member.status === 'away' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-gray-400'
                            }`} />
                          </div>
                          
                          {/* Nom */}
                          <h4 className="font-700 text-foreground text-xs sm:text-sm mb-0.5 truncate px-1 group-hover:text-primary transition-colors">
                            {member.prenom}
                          </h4>
                          <p className="font-600 text-foreground/70 text-[10px] sm:text-xs truncate px-1">
                            {member.nom}
                          </p>
                          
                          {/* Grade badge */}
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30">
                            <span className="text-[9px] sm:text-[10px] font-600 text-primary truncate">{member.grade}</span>
                          </div>
                          
                          {/* Hover arrow */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <i className="bi bi-arrow-right-circle-fill text-primary text-sm"></i>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Absences Section */}
        {activeSection === 'absences' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-800 text-foreground flex items-center gap-2">
                  <i className="bi bi-calendar-check text-primary"></i>
                  Demande d'Absence
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Informez la commission de votre absence</p>
              </div>
              <button
                onClick={() => setActiveSection('home')}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleAbsenceSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-600 text-foreground mb-2">Date de début</label>
                <input
                  type="date"
                  value={absenceForm.startDate}
                  onChange={(e) => setAbsenceForm({ ...absenceForm, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-600 text-foreground mb-2">Date de fin</label>
                <input
                  type="date"
                  value={absenceForm.endDate}
                  onChange={(e) => setAbsenceForm({ ...absenceForm, endDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-600 text-foreground mb-2">Raison</label>
                <textarea
                  value={absenceForm.reason}
                  onChange={(e) => setAbsenceForm({ ...absenceForm, reason: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Expliquez brièvement la raison de votre absence..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg gradient-orange text-primary-foreground font-700 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bi bi-arrow-repeat animate-spin"></i>
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bi bi-send-fill"></i>
                    Envoyer la demande
                  </span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Presidents Section */}
        {activeSection === 'presidents' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-800 text-foreground flex items-center gap-2">
                  <i className="bi bi-trophy-fill text-primary"></i>
                  Anciens Présidents
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {presidents.length} président{presidents.length > 1 ? 's' : ''} dans l'historique
                </p>
              </div>
              <button
                onClick={() => setActiveSection('home')}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>

            {loadingData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-muted"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-muted rounded w-32 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : presidents.length === 0 ? (
              <div className="text-center py-12">
                <i className="bi bi-trophy text-6xl text-muted-foreground mb-4"></i>
                <p className="text-muted-foreground">Aucun président trouvé</p>
                <p className="text-sm text-muted-foreground mt-2">L'historique des présidents apparaîtra ici</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {presidents.map((president) => (
                  <div key={president.id} className="neon-card p-6 rounded-xl bg-card border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-neon-orange">
                    <div className="flex items-center gap-4 mb-4">
                      {president.photo_url ? (
                        <img 
                          src={president.photo_url} 
                          alt={`${president.prenom} ${president.nom}`}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/30"
                        />
                      ) : (
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${president.president_color || 'from-blue-500 to-purple-500'} flex items-center justify-center text-white font-800 text-xl shadow-neon-orange`}>
                          {president.avatar}
                        </div>
                      )}
                      <div>
                        <p className="font-700 text-foreground text-lg">{president.prenom} {president.nom}</p>
                        <p className="text-sm text-primary font-600">Année {president.president_year || 'Non spécifiée'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {president.president_achievements || 'Réalisations et contributions durant le mandat...'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ideas Section */}
        {activeSection === 'ideas' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-800 text-foreground flex items-center gap-2">
                  <i className="bi bi-lightbulb-fill text-primary"></i>
                  Boîte à Idées
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Partagez vos suggestions avec les administrateurs</p>
              </div>
              <button
                onClick={() => setActiveSection('home')}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleIdeaSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-600 text-foreground mb-2">Votre idée ou suggestion</label>
                <textarea
                  value={ideaForm}
                  onChange={(e) => setIdeaForm(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Décrivez votre idée pour améliorer la commission..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg gradient-orange text-primary-foreground font-700 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bi bi-arrow-repeat animate-spin"></i>
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bi bi-send-fill"></i>
                    Envoyer l'idée
                  </span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Logos Section */}
        {activeSection === 'logos' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-800 text-foreground flex items-center gap-2">
                  <i className="bi bi-images text-primary"></i>
                  Galerie des Logos
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {logos.length} logo{logos.length > 1 ? 's' : ''} disponible{logos.length > 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setActiveSection('home')}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>

            {loadingData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                    <div className="w-full h-32 rounded-lg bg-muted mb-4"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : logos.length === 0 ? (
              <div className="text-center py-12">
                <i className="bi bi-images text-6xl text-muted-foreground mb-4 block"></i>
                <p className="text-muted-foreground">Aucun logo disponible</p>
                <p className="text-sm text-muted-foreground mt-2">Les logos uploadés par l'admin apparaîtront ici</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {logos.map((logo) => (
                  <div key={logo.id} className="neon-card p-6 rounded-xl bg-card border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-neon-orange">
                    <div className="w-full h-40 rounded-lg bg-white/5 flex items-center justify-center mb-4 overflow-hidden">
                      <img 
                        src={logo.file_url} 
                        alt={logo.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <h3 className="font-700 text-foreground mb-1">{logo.name}</h3>
                    {logo.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{logo.description}</p>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-muted-foreground">
                        {logo.file_type.toUpperCase()} • {(logo.file_size / 1024).toFixed(0)} KB
                      </span>
                      <span className="text-xs text-primary font-600">
                        <i className="bi bi-download mr-1"></i>
                        {logo.downloads_count || 0}
                      </span>
                    </div>
                    <button
                      onClick={async () => {
                        const fileName = `${logo.name}.${logo.file_type}`;
                        await logoService.downloadLogo(logo.id, logo.file_url, fileName);
                        loadLogos(); // Rafraîchir pour mettre à jour le compteur
                      }}
                      className="w-full py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-600 text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <i className="bi bi-download"></i>
                      Télécharger
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Support Section */}
        {activeSection === 'support' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-800 text-foreground flex items-center gap-2">
                  <i className="bi bi-flag-fill text-primary"></i>
                  Signaler un Problème
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Contactez l'administrateur pour un bug ou une aide</p>
              </div>
              <button
                onClick={() => setActiveSection('home')}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSupportSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-600 text-foreground mb-2">Sujet</label>
                <input
                  type="text"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Ex: Bug sur la page des membres"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-600 text-foreground mb-2">Description du problème</label>
                <textarea
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Décrivez le problème en détail..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg gradient-orange text-primary-foreground font-700 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bi bi-arrow-repeat animate-spin"></i>
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bi bi-send-fill"></i>
                    Envoyer le rapport
                  </span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Profile View Section */}
        {activeSection === 'profile' && selectedMember && (
          <ProfileView 
            member={selectedMember}
            currentUserId={userData?.id}
            onClose={() => {
              setActiveSection('members');
              setSelectedMember(null);
            }}
            onUpdate={() => {
              loadMembers();
              loadPresidents();
            }}
          />
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <AboutSection onClose={() => setActiveSection('home')} />
        )}

        {/* Meetings Section */}
        {activeSection === 'meetings' && (
          <MeetingsSection onClose={() => setActiveSection('home')} />
        )}
      </div>

      {/* Footer - Discret et Minimaliste */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground/70 font-500">
              © 2026 Commission Communication IAM | Keur Bourama. Tous droits réservés.
            </p>
            <p className="text-[10px] text-muted-foreground/50 font-400 flex items-center justify-center gap-1">
              Développé avec <span className="text-primary/70">🧡</span> par <span className="font-600 text-primary/80">SBCS</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de succès pour idée */}
      {showIdeaSuccessModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setShowIdeaSuccessModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-green-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-green-500/20 animate-slide-up">
              {/* Icon animé */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center animate-pulse">
                    <i className="bi bi-lightbulb-fill text-4xl text-green-400"></i>
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center animate-bounce">
                    <i className="bi bi-check-lg text-white font-bold"></i>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-800 text-foreground text-center mb-3">
                💡 Idée envoyée !
              </h2>
              
              <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                Votre suggestion a été transmise avec succès aux <span className="font-700 text-foreground">administrateurs</span>.
              </p>

              {/* Info box */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="bi bi-info-circle-fill text-green-400 text-xl flex-shrink-0 mt-0.5"></i>
                  <div className="text-sm text-foreground/80 leading-relaxed">
                    Votre idée sera <span className="font-700 text-green-400">examinée</span> par l'équipe administrative. Vous recevrez une notification dès qu'elle sera évaluée.
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => setShowIdeaSuccessModal(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-700 transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/30"
              >
                Parfait, merci !
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de succès pour support */}
      {showSupportSuccessModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setShowSupportSuccessModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-blue-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-blue-500/20 animate-slide-up">
              {/* Icon animé */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center animate-pulse">
                    <i className="bi bi-flag-fill text-4xl text-blue-400"></i>
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-bounce">
                    <i className="bi bi-check-lg text-white font-bold"></i>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-800 text-foreground text-center mb-3">
                🚩 Problème signalé !
              </h2>
              
              <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                Votre rapport a été transmis avec succès à <span className="font-700 text-foreground">l'administrateur</span>.
              </p>

              {/* Info box */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="bi bi-info-circle-fill text-blue-400 text-xl flex-shrink-0 mt-0.5"></i>
                  <div className="text-sm text-foreground/80 leading-relaxed">
                    Votre ticket a été créé avec la priorité <span className="font-700 text-blue-400">moyenne</span>. L'équipe technique vous contactera dans les plus brefs délais.
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => setShowSupportSuccessModal(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-700 transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/30"
              >
                Parfait, merci !
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function LoadingSkeleton({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-muted animate-pulse"></div>
          <div className="w-32 h-4 rounded bg-muted animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-muted animate-pulse"></div>
          <div className="w-8 h-8 rounded-lg bg-muted animate-pulse"></div>
          <div className="w-24 h-8 rounded-xl bg-muted animate-pulse"></div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 p-8 rounded-2xl bg-muted animate-pulse h-40"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-muted animate-pulse mb-4"></div>
              <div className="w-32 h-4 rounded bg-muted animate-pulse mb-2"></div>
              <div className="w-24 h-3 rounded bg-muted animate-pulse"></div>
            </div>
          ))}
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
        </div>
      </div>
    </div>
  );
}
