'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, LogOut, AlertTriangle } from 'lucide-react';
import LockCodeInput from './LockCodeInput';
import LockClock from './LockClock';

const SECRET_CODE = 'BOURAMA';
const MAX_ATTEMPTS = 5;

export default function LockPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [userData, setUserData] = useState<{ name: string; grade: string; avatar: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // BACKEND INTEGRATION POINT: validate session token, redirect if invalid
    const stored = sessionStorage.getItem('ch_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserData({ name: parsed.name, grade: parsed.grade, avatar: parsed.avatar });
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  }, []);

  const handleCodeChange = useCallback((newCode: string) => {
    if (isLocked) return;
    setCode(newCode);
    setError('');

    if (newCode.length === SECRET_CODE.length) {
      if (newCode.toUpperCase() === SECRET_CODE) {
        setIsSuccess(true);
        // BACKEND INTEGRATION POINT: POST /api/auth/verify-code to validate secret
        setTimeout(() => router.push('/chat-screen'), 1200);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        triggerShake();
        setCode('');

        if (newAttempts >= MAX_ATTEMPTS) {
          setIsLocked(true);
          setLockTimer(30);
          setError('');
          timerRef.current = setInterval(() => {
            setLockTimer((prev) => {
              if (prev <= 1) {
                clearInterval(timerRef.current!);
                setIsLocked(false);
                setAttempts(0);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setError(`Code incorrect. ${MAX_ATTEMPTS - newAttempts} tentative${MAX_ATTEMPTS - newAttempts > 1 ? 's' : ''} restante${MAX_ATTEMPTS - newAttempts > 1 ? 's' : ''}.`);
        }
      }
    }
  }, [attempts, isLocked, router, triggerShake]);

  const handleLogout = () => {
    sessionStorage.removeItem('ch_user');
    router.push('/sign-up-login-screen');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-diagonal-pattern" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary opacity-[0.04] blur-3xl pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 14 Q2 8 8 8 Q14 8 14 2" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <circle cx="2" cy="14" r="1.5" fill="#0A0A0A"/>
            </svg>
          </div>
          <span className="font-700 text-foreground text-sm tracking-tight">CommissionHub</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 px-3 py-1.5 rounded-lg hover:bg-card border border-transparent hover:border-border"
        >
          <LogOut size={14} />
          Déconnexion
        </button>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 animate-slide-up">
        {/* Clock */}
        <LockClock />

        {/* Lock card */}
        <div className="bg-card border border-border rounded-2xl p-8 mt-8 shadow-2xl">
          {/* Shield icon */}
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isSuccess
                ? 'bg-green-500/15 border-2 border-green-500/40'
                : isLocked
                ? 'bg-red-500/15 border-2 border-red-500/40' :'bg-primary/10 border-2 border-primary/30'
            }`}>
              <Shield
                size={28}
                className={`transition-colors duration-300 ${
                  isSuccess ? 'text-green-400' : isLocked ? 'text-red-400' : 'text-primary'
                }`}
              />
            </div>
          </div>

          {/* User info */}
          {userData && (
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-full gradient-orange flex items-center justify-center text-primary-foreground font-800 text-lg mb-2">
                {userData.avatar}
              </div>
              <p className="text-sm font-600 text-foreground">{userData.name}</p>
              <span className={`text-xs font-500 px-2 py-0.5 rounded-full mt-1 ${
                userData.grade === 'Responsable' ?'bg-yellow-400/10 text-yellow-400'
                  : userData.grade === 'Adjoint' ?'bg-blue-400/10 text-blue-400' :'bg-muted text-muted-foreground'
              }`}>
                {userData.grade}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-700 text-foreground mb-1">
              {isSuccess ? 'Accès accordé ✓' : isLocked ? 'Accès temporairement bloqué' : 'Vérification d\'identité'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isSuccess
                ? 'Redirection vers votre espace...'
                : isLocked
                ? `Réessayez dans ${lockTimer} secondes`
                : 'Saisissez le code secret de la commission'}
            </p>
          </div>

          {/* Code input */}
          {!isLocked && !isSuccess && (
            <div className={isShaking ? 'animate-shake' : ''}>
              <LockCodeInput
                value={code}
                onChange={handleCodeChange}
                length={SECRET_CODE.length}
                hasError={!!error}
                isSuccess={isSuccess}
              />
            </div>
          )}

          {/* Locked state */}
          {isLocked && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-600 text-red-400">Trop de tentatives</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Réessayez dans <span className="font-700 text-red-400 tabular-nums">{lockTimer}s</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && !isLocked && (
            <div className="mt-3 flex items-center gap-2 justify-center animate-fade-in">
              <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400 font-500">{error}</p>
            </div>
          )}

          {/* Attempt dots */}
          {!isLocked && !isSuccess && attempts > 0 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div
                  key={`attempt-dot-${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    i < attempts ? 'bg-red-400' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Success state */}
          {isSuccess && (
            <div className="flex items-center justify-center gap-2 py-4 animate-fade-in">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-sm font-600 text-green-400">Authentification réussie</span>
            </div>
          )}
        </div>

        {/* Security notice */}
        <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
          🔒 Session sécurisée · Données chiffrées
        </p>
      </div>
    </div>
  );
}