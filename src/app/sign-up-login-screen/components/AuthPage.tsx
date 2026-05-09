'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AuthBrandPanel from './AuthBrandPanel';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Brand Panel */}
      <AuthBrandPanel />

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-20 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 14 Q2 8 8 8 Q14 8 14 2" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <path d="M2 14 Q2 10 6 10 Q10 10 10 6" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
                  <circle cx="2" cy="14" r="1.5" fill="#0A0A0A"/>
                </svg>
              </div>
              <span className="font-bold text-foreground text-lg tracking-tight">CommissionHub</span>
            </div>
            <h1 className="text-2xl font-700 text-foreground mb-1">
              {activeTab === 'login' ? 'Bienvenue à la commission communication 👋' : 'Créer un compte'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {activeTab === 'login' ? 'Connectez-vous à votre espace' : 'Rejoignez la Commission Communication'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 bg-card rounded-xl p-1 border border-border">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-600 transition-all duration-200 ${
                activeTab === 'login' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-600 transition-all duration-200 ${
                activeTab === 'register' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Form */}
          <div className="animate-fade-in">
            {activeTab === 'login' ? <LoginForm /> : <RegisterForm onSuccess={() => setActiveTab('login')} />}
          </div>
        </div>
      </div>
    </div>
  );
}