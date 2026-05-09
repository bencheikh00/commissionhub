'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UserPlus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService, RegisterData } from '@/lib/supabase/auth';

interface RegisterFormData {
  prenom: string;
  nom: string;
  email: string;
  grade: 'Alpha' | 'Gamma' | 'Kappa' | 'Delta' | 'Oméga' | 'Haut communicant' | 'Très haut communicant' | 'Plus';
  wasPresident: boolean;
  presidentYear?: string;
  photo: FileList;
  password: string;
  confirmPassword: string;
}

interface Props {
  onSuccess: () => void;
}

const GRADES = [
  {
    value: 'Alpha' as const,
    label: 'Alpha',
    icon: '🔷',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/30',
    activeBg: 'bg-blue-400/15 border-blue-400',
  },
  {
    value: 'Gamma' as const,
    label: 'Gamma',
    icon: '🟢',
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/30',
    activeBg: 'bg-green-400/15 border-green-400',
  },
  {
    value: 'Kappa' as const,
    label: 'Kappa',
    icon: '🟣',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/30',
    activeBg: 'bg-purple-400/15 border-purple-400',
  },
  {
    value: 'Delta' as const,
    label: 'Delta',
    icon: '🔺',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/30',
    activeBg: 'bg-red-400/15 border-red-400',
  },
  {
    value: 'Oméga' as const,
    label: 'Oméga',
    icon: '⭕',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/30',
    activeBg: 'bg-orange-400/15 border-orange-400',
  },
  {
    value: 'Haut communicant' as const,
    label: 'Haut communicant',
    icon: '⭐',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/30',
    activeBg: 'bg-yellow-400/15 border-yellow-400',
  },
  {
    value: 'Très haut communicant' as const,
    label: 'Très haut communicant',
    icon: '👑',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/30',
    activeBg: 'bg-amber-400/15 border-amber-400',
  },
  {
    value: 'Plus' as const,
    label: 'Plus',
    icon: '➕',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10 border-cyan-400/30',
    activeBg: 'bg-cyan-400/15 border-cyan-400',
  },
];

export default function RegisterForm({ onSuccess }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: { grade: 'Alpha', wasPresident: false },
  });

  const selectedGrade = watch('grade');
  const passwordValue = watch('password');
  const wasPresident = watch('wasPresident');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authService.register({
        email: data.email,
        password: data.password,
        prenom: data.prenom,
        nom: data.nom,
        grade: data.grade,
        photo: data.photo[0],
        wasPresident: data.wasPresident,
        presidentYear: data.presidentYear,
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      alert('Erreur lors de l\'inscription: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-green-400" />
        </div>
        <h3 className="text-lg font-700 text-foreground mb-2">Compte créé !</h3>
        <p className="text-sm text-muted-foreground text-center">
          Votre compte a été créé avec succès. Redirection vers la connexion...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="reg-prenom" className="block text-sm font-600 text-foreground">
            Prénom <span className="text-red-400">*</span>
          </label>
          <input
            id="reg-prenom"
            type="text"
            autoComplete="given-name"
            placeholder="Amadou"
            className={`w-full px-3.5 py-3 rounded-xl bg-input border text-foreground text-sm placeholder:text-muted-foreground transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              errors.prenom ? 'border-red-500/60' : 'border-border hover:border-muted-foreground'
            }`}
            {...register('prenom', { required: 'Prénom requis', minLength: { value: 2, message: 'Minimum 2 caractères' } })}
          />
          {errors.prenom && <p className="text-red-400 text-xs font-500">{errors.prenom.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="reg-nom" className="block text-sm font-600 text-foreground">
            Nom <span className="text-red-400">*</span>
          </label>
          <input
            id="reg-nom"
            type="text"
            autoComplete="family-name"
            placeholder="Diallo"
            className={`w-full px-3.5 py-3 rounded-xl bg-input border text-foreground text-sm placeholder:text-muted-foreground transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              errors.nom ? 'border-red-500/60' : 'border-border hover:border-muted-foreground'
            }`}
            {...register('nom', { required: 'Nom requis', minLength: { value: 2, message: 'Minimum 2 caractères' } })}
          />
          {errors.nom && <p className="text-red-400 text-xs font-500">{errors.nom.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="block text-sm font-600 text-foreground">
          Adresse e-mail <span className="text-red-400">*</span>
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="Entrez votre adresse email"
          className={`w-full px-4 py-3 rounded-xl bg-input border text-foreground text-sm placeholder:text-muted-foreground transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            errors.email ? 'border-red-500/60' : 'border-border hover:border-muted-foreground'
          }`}
          {...register('email', {
            required: "E-mail requis",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Format invalide" },
          })}
        />
        {errors.email && (
          <p className="text-red-400 text-xs font-500 flex items-center gap-1">
            <AlertCircle size={12} />{errors.email.message}
          </p>
        )}
      </div>

      {/* Grade selector */}
      <div className="space-y-2">
        <label className="block text-sm font-600 text-foreground">
          Grade <span className="text-red-400">*</span>
        </label>
        <p className="text-xs text-muted-foreground">Sélectionnez votre grade au sein de la commission</p>
        <div className="grid grid-cols-4 gap-2">
          {GRADES.map((grade) => (
            <button
              key={`grade-${grade.value}`}
              type="button"
              onClick={() => setValue('grade', grade.value)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                selectedGrade === grade.value ? grade.activeBg : grade.bg
              } hover:opacity-90 active:scale-95`}
            >
              <span className="text-base">{grade.icon}</span>
              <span className={`text-[10px] font-700 text-center leading-tight ${
                selectedGrade === grade.value ? grade.color : 'text-muted-foreground'
              }`}>
                {grade.label}
              </span>
            </button>
          ))}
        </div>
        <input type="hidden" {...register('grade', { required: true })} />
      </div>

      {/* Photo upload */}
      <div className="space-y-1.5">
        <label htmlFor="reg-photo" className="block text-sm font-600 text-foreground">
          Photo de profil <span className="text-red-400">*</span>
        </label>
        <input
          id="reg-photo"
          type="file"
          accept="image/*"
          className={`w-full px-4 py-3 rounded-xl bg-input border text-foreground text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-600 file:bg-primary file:text-primary-foreground hover:file:opacity-90 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            errors.photo ? 'border-red-500/60' : 'border-border hover:border-muted-foreground'
          }`}
          {...register('photo', { required: 'La photo est obligatoire' })}
        />
        {errors.photo && (
          <p className="text-red-400 text-xs font-500 flex items-center gap-1">
            <AlertCircle size={12} />{errors.photo.message}
          </p>
        )}
      </div>

      {/* Was President */}
      <div className="space-y-2">
        <label className="block text-sm font-600 text-foreground">
          As-tu déjà été président ? <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setValue('wasPresident', true)}
            className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-200 font-600 text-sm ${
              wasPresident
                ? 'bg-primary/15 border-primary text-primary'
                : 'bg-input border-border text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            Oui
          </button>
          <button
            type="button"
            onClick={() => {
              setValue('wasPresident', false);
              setValue('presidentYear', undefined);
            }}
            className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-200 font-600 text-sm ${
              !wasPresident
                ? 'bg-primary/15 border-primary text-primary'
                : 'bg-input border-border text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            Non
          </button>
        </div>
        <input type="hidden" {...register('wasPresident')} />
      </div>

      {/* President Year (conditional) */}
      {wasPresident && (
        <div className="space-y-1.5 animate-fade-in">
          <label htmlFor="reg-year" className="block text-sm font-600 text-foreground">
            Année de présidence <span className="text-red-400">*</span>
          </label>
          <input
            id="reg-year"
            type="text"
            placeholder="Ex: 2023"
            className={`w-full px-4 py-3 rounded-xl bg-input border text-foreground text-sm placeholder:text-muted-foreground transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              errors.presidentYear ? 'border-red-500/60' : 'border-border hover:border-muted-foreground'
            }`}
            {...register('presidentYear', {
              required: wasPresident ? 'L\'année est requise' : false,
              pattern: {
                value: /^(19|20)\d{2}$/,
                message: 'Année invalide (ex: 2023)',
              },
            })}
          />
          {errors.presidentYear && (
            <p className="text-red-400 text-xs font-500 flex items-center gap-1">
              <AlertCircle size={12} />{errors.presidentYear.message}
            </p>
          )}
        </div>
      )}

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-password" className="block text-sm font-600 text-foreground">
          Mot de passe <span className="text-red-400">*</span>
        </label>
        <p className="text-xs text-muted-foreground">Minimum 8 caractères, incluant chiffres et symboles</p>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••••••"
            className={`w-full px-4 py-3 pr-12 rounded-xl bg-input border text-foreground text-sm placeholder:text-muted-foreground transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              errors.password ? 'border-red-500/60' : 'border-border hover:border-muted-foreground'
            }`}
            {...register('password', {
              required: 'Mot de passe requis',
              minLength: { value: 8, message: 'Minimum 8 caractères' },
              pattern: {
                value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                message: 'Doit contenir un chiffre et un symbole',
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
            aria-label={showPassword ? 'Masquer' : 'Afficher'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs font-500 flex items-center gap-1">
            <AlertCircle size={12} />{errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-confirm" className="block text-sm font-600 text-foreground">
          Confirmer le mot de passe <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            id="reg-confirm"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••••••"
            className={`w-full px-4 py-3 pr-12 rounded-xl bg-input border text-foreground text-sm placeholder:text-muted-foreground transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              errors.confirmPassword ? 'border-red-500/60' : 'border-border hover:border-muted-foreground'
            }`}
            {...register('confirmPassword', {
              required: 'Confirmation requise',
              validate: (val) => val === passwordValue || 'Les mots de passe ne correspondent pas',
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
            aria-label={showConfirm ? 'Masquer' : 'Afficher'}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs font-500 flex items-center gap-1">
            <AlertCircle size={12} />{errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        En créant un compte, vous acceptez nos{' '}
        <span className="text-primary cursor-pointer hover:underline">Conditions d'utilisation</span>{' '}
        et notre{' '}
        <span className="text-primary cursor-pointer hover:underline">Politique de confidentialité</span>.
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl gradient-orange text-primary-foreground font-700 text-sm flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed glow-orange-sm"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Création du compte...</span>
          </>
        ) : (
          <>
            <UserPlus size={16} />
            <span>Créer mon compte</span>
          </>
        )}
      </button>
    </form>
  );
}