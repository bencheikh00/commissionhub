'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, AlertCircle, Loader2, CheckCircle2, CalendarOff } from 'lucide-react';

interface AbsenceFormData {
  type: 'absence' | 'retard' | 'conge';
  dateDebut: string;
  dateFin: string;
  motif: string;
  justificatif: boolean;
}

interface Props {
  onClose: () => void;
}

const ABSENCE_TYPES = [
  { value: 'absence' as const, label: 'Absence', icon: '🚫' },
  { value: 'retard' as const, label: 'Retard', icon: '⏰' },
  { value: 'conge' as const, label: 'Congé', icon: '🌴' },
];

export default function AbsenceModal({ onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AbsenceFormData>({
    defaultValues: { type: 'absence', justificatif: false },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: AbsenceFormData) => {
    setIsLoading(true);
    // BACKEND INTEGRATION POINT: POST /api/absences with member session ID
    await new Promise((r) => setTimeout(r, 1400));
    console.log('Absence request:', data);
    setSuccess(true);
    setIsLoading(false);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarOff size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-700 text-foreground">Demande d'absence</h2>
              <p className="text-xs text-muted-foreground">Formulaire officiel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-3 animate-bounce">
                <CheckCircle2 size={28} className="text-green-400" />
              </div>
              <h3 className="text-base font-700 text-foreground mb-1">✅ Demande envoyée avec succès !</h3>
              <p className="text-sm text-muted-foreground text-center">
                Votre demande a été soumise et sera traitée par l'administrateur.
              </p>
              <p className="text-xs text-green-400 text-center mt-2">
                📧 Vous recevrez un email de confirmation
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Type selector */}
              <div className="space-y-2">
                <label className="block text-sm font-600 text-foreground">
                  Type d'absence <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ABSENCE_TYPES.map((type) => (
                    <button
                      key={`absence-type-${type.value}`}
                      type="button"
                      onClick={() => setValue('type', type.value)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200 active:scale-95 ${
                        selectedType === type.value
                          ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background text-muted-foreground hover:border-muted-foreground'
                      }`}
                    >
                      <span className="text-lg">{type.icon}</span>
                      <span className="text-xs font-600">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="abs-debut" className="block text-sm font-600 text-foreground">
                    Date de début <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="abs-debut"
                    type="date"
                    className={`w-full px-3 py-2.5 rounded-xl bg-input border text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${
                      errors.dateDebut ? 'border-red-500/60' : 'border-border hover:border-muted-foreground'
                    }`}
                    {...register('dateDebut', { required: 'Date requise' })}
                  />
                  {errors.dateDebut && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle size={11} />{errors.dateDebut.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="abs-fin" className="block text-sm font-600 text-foreground">
                    Date de fin <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="abs-fin"
                    type="date"
                    className={`w-full px-3 py-2.5 rounded-xl bg-input border text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${
                      errors.dateFin ? 'border-red-500/60' : 'border-border hover:border-muted-foreground'
                    }`}
                    {...register('dateFin', { required: 'Date requise' })}
                  />
                  {errors.dateFin && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle size={11} />{errors.dateFin.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Motif */}
              <div className="space-y-1.5">
                <label htmlFor="abs-motif" className="block text-sm font-600 text-foreground">
                  Motif <span className="text-red-400">*</span>
                </label>
                <p className="text-xs text-muted-foreground">Décrivez la raison de votre absence</p>
                <textarea
                  id="abs-motif"
                  rows={3}
                  placeholder="Ex: Rendez-vous médical, déplacement professionnel..."
                  className={`w-full px-4 py-3 rounded-xl bg-input border text-foreground text-sm placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none scrollbar-thin ${
                    errors.motif ? 'border-red-500/60' : 'border-border hover:border-muted-foreground'
                  }`}
                  {...register('motif', {
                    required: 'Le motif est requis',
                    minLength: { value: 10, message: 'Minimum 10 caractères' },
                  })}
                />
                {errors.motif && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={11} />{errors.motif.message}
                  </p>
                )}
              </div>

              {/* Justificatif */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-background border border-border">
                <input
                  id="abs-justif"
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-border bg-input accent-primary cursor-pointer flex-shrink-0"
                  {...register('justificatif')}
                />
                <div>
                  <label htmlFor="abs-justif" className="text-sm font-600 text-foreground cursor-pointer">
                    Justificatif disponible
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Je fournirai un justificatif au responsable
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-border text-sm font-600 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 active:scale-[0.98]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl gradient-orange text-primary-foreground text-sm font-700 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    'Soumettre'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}