import React from 'react';

export default function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] 2xl:w-[640px] flex-col justify-between relative overflow-hidden bg-card border-r border-border p-12">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-diagonal-pattern opacity-60" />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary opacity-5 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent opacity-5 blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      {/* Content */}
      <div className="relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center glow-orange-sm">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 17 Q3 10 10 10 Q17 10 17 3" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M3 17 Q3 12.5 7.5 12.5 Q12 12.5 12 8" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
              <circle cx="3" cy="17" r="2" fill="#0A0A0A"/>
            </svg>
          </div>
          <div>
            <div className="font-800 text-foreground text-xl tracking-tight">CommissionHub</div>
            <div className="text-xs text-muted-foreground font-500 tracking-widest uppercase">Commission Communication</div>
          </div>
        </div>

        {/* Headline */}
        <div className="mb-12">
          <h2 className="text-4xl font-800 text-foreground leading-tight mb-4">
            Votre espace<br />
            <span className="text-primary">collaboratif</span><br />
            sécurisé
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xs">
            Gérez les membres, communiquez en temps réel et suivez les activités administratives de votre commission.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-4">
          {[
            { icon: '💬', text: 'Messagerie instantanée sécurisée' },
            { icon: '👥', text: 'Gestion des membres et présences' },
            { icon: '📅', text: 'Réunions et ordres du jour' },
            { icon: '🔒', text: 'Double authentification' },
          ]?.map((feature) => (
            <div key={`feature-${feature?.icon}`} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm flex-shrink-0">
                {feature?.icon}
              </div>
              <span className="text-sm text-secondary-foreground font-500">{feature?.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}