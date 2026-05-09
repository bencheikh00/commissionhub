'use client';

import React, { useState } from 'react';
import { Megaphone, Pin, ChevronRight, Clock } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  body: string;
  date: string;
  category: 'annonce' | 'urgent' | 'info';
  pinned?: boolean;
  author: string;
}

const NEWS: NewsItem[] = [
  {
    id: 'news-001',
    title: 'Réunion plénière — Mai 2026',
    body: 'La réunion plénière mensuelle aura lieu le 10 mai à 14h00 en salle de conférence A. Présence obligatoire pour tous les membres actifs.',
    date: "Aujourd'hui",
    category: 'urgent',
    pinned: true,
    author: 'Dr. Bourama Kouyaté',
  },
  {
    id: 'news-002',
    title: 'Nouveau règlement intérieur',
    body: 'Le règlement intérieur mis à jour est disponible. Tous les membres sont priés de le consulter avant le 15 mai.',
    date: 'Il y a 2 jours',
    category: 'annonce',
    pinned: false,
    author: 'Mme. Aminata Diallo',
  },
  {
    id: 'news-003',
    title: 'Campagne de communication Q2',
    body: 'Le lancement de la campagne de communication du deuxième trimestre est prévu pour le 20 mai. Les équipes sont invitées à soumettre leurs propositions.',
    date: 'Il y a 3 jours',
    category: 'info',
    pinned: false,
    author: 'Amadou Diallo',
  },
  {
    id: 'news-004',
    title: 'Formation — Outils numériques',
    body: 'Une formation sur les outils numériques de communication sera organisée le 18 mai en visioconférence. Inscription avant le 12 mai.',
    date: 'Il y a 5 jours',
    category: 'annonce',
    pinned: false,
    author: 'Mme. Aminata Diallo',
  },
  {
    id: 'news-005',
    title: 'Résultats — Bilan T1 2026',
    body: 'Le bilan du premier trimestre 2026 est disponible. Les résultats sont globalement positifs avec une progression de 12% des activités.',
    date: 'Il y a 1 semaine',
    category: 'info',
    pinned: false,
    author: 'Dr. Bourama Kouyaté',
  },
];

const CATEGORY_STYLES: Record<string, string> = {
  urgent: 'bg-red-500/15 text-red-400 border-red-500/30',
  annonce: 'bg-primary/15 text-primary border-primary/30',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
};

const CATEGORY_LABELS: Record<string, string> = {
  urgent: 'Urgent',
  annonce: 'Annonce',
  info: 'Info',
};

export default function NewsPanel() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const pinned = NEWS.filter((n) => n.pinned);
  const rest = NEWS.filter((n) => !n.pinned);

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-700 text-foreground uppercase tracking-wider">Actualités</h3>
          <span className="text-xs text-muted-foreground tabular-nums">{NEWS.length} publications</span>
        </div>

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-600">
              <Pin size={10} className="text-primary" />
              <span>Épinglé</span>
            </div>
            {pinned.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                expanded={expanded === item.id}
                onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
              />
            ))}
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div className="space-y-2">
            {pinned.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-600 pt-1">
                <Megaphone size={10} />
                <span>Récentes</span>
              </div>
            )}
            {rest.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                expanded={expanded === item.id}
                onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface NewsCardProps {
  item: NewsItem;
  expanded: boolean;
  onToggle: () => void;
}

function NewsCard({ item, expanded, onToggle }: NewsCardProps) {
  return (
    <div
      className={`rounded-xl border transition-all duration-200 cursor-pointer group ${
        expanded
          ? 'bg-background border-primary/30' :'bg-background border-border hover:border-primary/30'
      }`}
      onClick={onToggle}
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-xs font-600 text-foreground leading-snug flex-1">{item.title}</h4>
          <span
            className={`text-[10px] font-600 px-1.5 py-0.5 rounded-full border flex-shrink-0 ${CATEGORY_STYLES[item.category]}`}
          >
            {CATEGORY_LABELS[item.category]}
          </span>
        </div>

        {expanded && (
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-2.5 animate-fade-in">
            {item.body}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Clock size={10} className="flex-shrink-0" />
            <span>{item.date}</span>
            <span className="mx-0.5">·</span>
            <span className="truncate max-w-[90px]">{item.author}</span>
          </div>
          <ChevronRight
            size={12}
            className={`text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-90 text-primary' : 'group-hover:text-primary'}`}
          />
        </div>
      </div>
    </div>
  );
}
