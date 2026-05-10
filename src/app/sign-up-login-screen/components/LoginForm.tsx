'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '@/lib/supabase/auth';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

// MOCK credentials — backend: replace with POST /api/auth/login
const MOCK_CREDENTIALS = {
  email: 'responsable@commission.fr',
  password: 'Commission2026!',
};

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { remember: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError('');

    try {
      const user = await authService.login(data.email, data.password);
      
      sessionStorage.setItem('ch_user', JSON.stringify(user));
<<<<<<< HEAD
      router.push('/lock-screen-new');
=======
      router.push('/lock-screen');
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
    } catch (error: any) {
      setAuthError(error.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setValue('email', MOCK_CREDENTIALS.email);
    setValue('password', MOCK_CREDENTIALS.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Auth error */}
      {authError && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in">
          <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-sm font-500">{authError}</p>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-sm font-600 text-foreground">
          Adresse e-mail
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="Entrez votre adresse email"
          className={`w-full px-4 py-3 rounded-xl bg-input border text-foreground text-sm placeholder:text-muted-foreground transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            errors.email ? 'border-red-500/60 bg-red-500/5' : 'border-border hover:border-muted-foreground'
          }`}
          {...register('email', {
            required: "L'adresse e-mail est requise",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Format d'e-mail invalide",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-400 text-xs font-500 flex items-center gap-1 mt-1">
            <AlertCircle size={12} />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="block text-sm font-600 text-foreground">
            Mot de passe
          </label>
          <button
            type="button"
            className="text-xs text-primary hover:text-accent transition-colors duration-150 font-500"
          >
            Mot de passe oublié ?
          </button>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••••••"
            className={`w-full px-4 py-3 pr-12 rounded-xl bg-input border text-foreground text-sm placeholder:text-muted-foreground transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              errors.password ? 'border-red-500/60 bg-red-500/5' : 'border-border hover:border-muted-foreground'
            }`}
            {...register('password', {
              required: 'Le mot de passe est requis',
              minLength: { value: 6, message: 'Minimum 6 caractères' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150 p-0.5"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs font-500 flex items-center gap-1 mt-1">
            <AlertCircle size={12} />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2.5">
        <input
          id="login-remember"
          type="checkbox"
          className="w-4 h-4 rounded border-border bg-input accent-primary cursor-pointer"
          {...register('remember')}
        />
        <label htmlFor="login-remember" className="text-sm text-muted-foreground cursor-pointer select-none">
          Se souvenir de moi
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl gradient-orange text-primary-foreground font-700 text-sm flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 glow-orange-sm mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Connexion en cours...</span>
          </>
        ) : (
          <>
            <LogIn size={16} />
            <span>Se connecter</span>
          </>
        )}
      </button>
    </form>
  );
}