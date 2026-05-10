'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CORRECT_PIN = 'BOURAMA';

export default function LockScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('ch_user');
    if (stored) {
      setUserData(JSON.parse(stored));
    } else {
      router.push('/sign-up-login-screen');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.toUpperCase() === CORRECT_PIN) {
      router.push('/dashboard-new');
    } else {
      setAttempts(attempts + 1);
      setError('Code PIN incorrect');
      setPin('');
      
      if (attempts >= 2) {
        alert('Trop de tentatives échouées. Vous allez être déconnecté.');
        sessionStorage.removeItem('ch_user');
        router.push('/sign-up-login-screen');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Security Alert */}
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border-2 border-red-500 animate-pulse">
          <div className="flex items-start gap-3">
            <i className="bi bi-exclamation-triangle-fill text-red-500 text-2xl flex-shrink-0 mt-1"></i>
            <div>
              <h3 className="font-bold text-red-500 mb-2 flex items-center gap-2">
                <i className="bi bi-shield-lock-fill"></i>
                ALERTE SÉCURITÉ
              </h3>
              <p className="text-red-400 text-sm leading-relaxed">
                L'accès à ce portail est sous haute surveillance. Toute fuite ou transmission de ce code PIN 
                sera tracée. La sanction pour compromission de nos accès est la révocation instantanée et 
                l'expulsion définitive de la commission.
              </p>
            </div>
          </div>
        </div>

        {/* Lock Screen Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-800">
          {/* User Info */}
          <div className="text-center mb-8">
            {userData?.photo_url ? (
              <img 
                src={userData.photo_url} 
                alt="" 
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-orange-500 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 border-4 border-orange-500">
                {userData?.avatar}
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {userData?.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{userData?.grade}</p>
          </div>

          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
              <i className="bi bi-lock-fill text-orange-500 text-3xl"></i>
            </div>
          </div>

          {/* PIN Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 text-center">
                <i className="bi bi-key-fill text-orange-500 mr-2"></i>
                Entrez le code PIN de sécurité
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="CODE PIN"
                maxLength={10}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center text-2xl font-bold tracking-widest uppercase focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-red-500 text-sm text-center flex items-center justify-center gap-2">
                  <i className="bi bi-x-circle-fill"></i>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              <i className="bi bi-unlock-fill"></i>
              Déverrouiller
            </button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <i className="bi bi-info-circle-fill text-orange-500 mr-1"></i>
              Le code PIN vous a été communiqué en interne
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              sessionStorage.removeItem('ch_user');
              router.push('/sign-up-login-screen');
            }}
            className="w-full mt-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <i className="bi bi-box-arrow-left"></i>
            Se déconnecter
          </button>
        </div>

        {/* Footer Warning */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
            <i className="bi bi-eye-fill text-orange-500"></i>
            Tentatives restantes : {3 - attempts}/3
          </p>
        </div>
      </div>
    </div>
  );
}
