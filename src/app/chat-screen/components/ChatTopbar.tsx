'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Bell, LogOut, Settings, ChevronDown, Circle, Users, Calendar, Crown, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  onMenuToggle: () => void;
}

export default function ChatTopbar({ onMenuToggle }: Props) {
  const router = useRouter();
  const [userData, setUserData] = useState<{ name: string; grade: string; avatar: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [notifCount] = useState(3);

  useEffect(() => {
    const stored = sessionStorage.getItem('ch_user');
    if (stored) setUserData(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('ch_user');
    // BACKEND INTEGRATION POINT: POST /api/auth/logout to destroy session
    router.push('/sign-up-login-screen');
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-card flex-shrink-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowMainMenu(!showMainMenu)}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150 relative"
          aria-label="Menu principal"
        >
          <Menu size={18} />
        </button>

        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
          aria-label="Membres sidebar"
        >
          <Users size={18} />
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
          </div>
        </div>

        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <Circle size={6} className="text-green-400 fill-green-400 animate-pulse" />
          <span className="text-xs font-600 text-green-400">En ligne</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150">
          <Bell size={18} />
          {notifCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-800 flex items-center justify-center">
              {notifCount}
            </span>
          )}
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-xl hover:bg-muted transition-all duration-150 group"
          >
            <div className="w-7 h-7 rounded-full gradient-orange flex items-center justify-center text-primary-foreground font-800 text-xs flex-shrink-0">
              {userData?.avatar || 'AD'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-600 text-foreground leading-none">{userData?.name || 'Amadou Diallo'}</p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">{userData?.grade || 'Responsable'}</p>
            </div>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1 animate-fade-in">
              <div className="px-3 py-2.5 border-b border-border">
                <p className="text-xs font-600 text-foreground">{userData?.name || 'Amadou Diallo'}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{userData?.grade || 'Responsable'}</p>
              </div>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150">
                <Settings size={14} />
                Paramètres du profil
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-150"
              >
                <LogOut size={14} />
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
          </div>
        </>
      )}
    </header>
  );
}