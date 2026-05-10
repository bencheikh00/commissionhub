'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomeScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<{ name: string; grade: string; avatar: string } | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('ch_user');
    if (stored) {
      setUserData(JSON.parse(stored));
    } else {
      router.push('/sign-up-login-screen');
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    setTimeout(() => setShowContent(true), 300);

    const redirectTimer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  const handleContinue = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-diagonal-pattern" />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary opacity-10 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary opacity-10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        <div className={`mb-8 flex justify-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center glow-orange shadow-2xl bg-white p-2">
            <img 
              src="/assets/images/app_logo.png" 
              alt="Logo Commission" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <h1 
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-800 text-foreground mb-6 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ animationDelay: '0.2s' }}
        >
          <span className="inline-block animate-fade-in">Bienvenue</span>{' '}
          <span className="inline-block animate-fade-in" style={{ animationDelay: '0.3s' }}>chez</span>{' '}
          <span className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Bourama
          </span>
          <span className="inline-block animate-wave ml-2" style={{ animationDelay: '0.7s' }}>
            <i className="bi bi-hand-wave-fill text-primary"></i>
          </span>
        </h1>

        <div className={`flex items-center justify-center gap-3 mb-8 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '0.4s' }}>
          <div className="w-12 h-12 rounded-full gradient-orange flex items-center justify-center text-primary-foreground font-800 text-lg shadow-lg">
            {userData?.avatar || 'U'}
          </div>
          <div className="text-left">
            <p className="text-base font-700 text-foreground">{userData?.name || 'Utilisateur'}</p>
            <p className="text-sm text-muted-foreground">{userData?.grade || 'Membre'}</p>
          </div>
        </div>

        <div 
          className={`max-w-3xl mx-auto mb-10 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ animationDelay: '0.6s' }}
        >
          <div className="relative p-8 rounded-2xl bg-card border-2 border-primary/20 shadow-2xl backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary rounded-tl-2xl opacity-50" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary rounded-tr-2xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary rounded-bl-2xl opacity-50" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary rounded-br-2xl opacity-50" />

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <i className="bi bi-shield-lock-fill text-2xl text-primary"></i>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-foreground/90 font-500 text-center">
              L'accès à cette plateforme est{' '}
              <span className="font-700 text-primary">strictement réservé</span>{' '}
              aux membres actifs de la{' '}
              <span className="font-700 text-foreground">Commission Communication</span>.
            </p>
            
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto my-6" />

            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-center">
              Cet environnement privé et sécurisé a pour but de protéger nos données internes 
              tout en offrant des outils performants pour{' '}
              <span className="text-foreground font-600">collaborer</span>,{' '}
              <span className="text-foreground font-600">innover</span> et{' '}
              <span className="text-foreground font-600">piloter</span> nos campagnes de communication 
              en toute confidentialité.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <i className="bi bi-lock-fill text-xs text-primary"></i>
                <span className="text-xs font-600 text-primary">Chiffré</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <i className="bi bi-shield-check text-xs text-primary"></i>
                <span className="text-xs font-600 text-primary">Sécurisé</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <i className="bi bi-eye-slash-fill text-xs text-primary"></i>
                <span className="text-xs font-600 text-primary">Confidentiel</span>
              </div>
            </div>
          </div>
        </div>

        <div 
          className={`max-w-md mx-auto mb-6 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ animationDelay: '0.8s' }}
        >
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-orange transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Chargement de votre espace... {progress}%
          </p>
        </div>

        <button
          onClick={handleContinue}
          className={`px-8 py-3.5 rounded-xl gradient-orange text-primary-foreground font-700 text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ animationDelay: '1s' }}
        >
          <span className="flex items-center gap-2">
            Accéder au Dashboard
            <i className="bi bi-arrow-right text-lg"></i>
          </span>
        </button>

        <p 
          className={`text-xs text-muted-foreground mt-4 transition-all duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}
          style={{ animationDelay: '1.2s' }}
        >
          Redirection automatique dans quelques secondes...
        </p>

        {/* Footer - Discret */}
        <div className="mt-12 text-center space-y-1.5 opacity-50">
          <p className="text-[10px] text-muted-foreground/60 font-500">
            © 2026 Commission Communication IAM | Keur Bourama
          </p>
          <p className="text-[9px] text-muted-foreground/40 font-400 flex items-center justify-center gap-1">
            Développé avec <span className="text-primary/50">🧡</span> par <span className="font-600 text-primary/60">SBCS</span>
          </p>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
