'use client';

import React, { useState } from 'react';
import { Copy, CheckCheck, KeyRound } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { role: 'Responsable', email: 'responsable@commission.fr', password: 'Commission2026!' },
  { role: 'Adjoint', email: 'adjoint@commission.fr', password: 'Commission2026!' },
  { role: 'Membre', email: 'membre@commission.fr', password: 'Commission2026!' },
];

export default function CredentialsBox() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5 animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <KeyRound size={14} className="text-primary" />
        <span className="text-xs font-700 text-primary uppercase tracking-wider">Comptes démo</span>
      </div>
      <div className="space-y-2">
        {DEMO_ACCOUNTS.map((account) => (
          <div key={`demo-${account.role}`} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors duration-150">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-600 text-primary flex-shrink-0 w-20">{account.role}</span>
              <span className="text-xs text-muted-foreground truncate">{account.email}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(account.email, `email-${account.role}`)}
              className="flex-shrink-0 p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-150"
              aria-label={`Copier l'email ${account.role}`}
            >
              {copiedField === `email-${account.role}` ? (
                <CheckCheck size={12} className="text-green-400" />
              ) : (
                <Copy size={12} />
              )}
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Mot de passe identique pour tous les comptes
      </p>
    </div>
  );
}