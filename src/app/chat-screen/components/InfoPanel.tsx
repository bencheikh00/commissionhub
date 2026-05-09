'use client';

import React, { useState } from 'react';
import { Calendar, Clock, FileText, Users, ChevronRight, Plus, Megaphone } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';
import NewsPanel from './NewsPanel';


interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'today' | 'tomorrow';
}

const MEETINGS: Meeting[] = [
  {
    id: 'meeting-001',
    title: 'Réunion mensuelle — Bilan activités',
    date: '10/05/2026',
    time: '14:00',
    location: 'Salle de conférence A',
    attendees: 12,
    status: 'tomorrow',
  },
  {
    id: 'meeting-002',
    title: 'Atelier Communication Digitale',
    date: '15/05/2026',
    time: '10:00',
    location: 'Visioconférence',
    attendees: 8,
    status: 'upcoming',
  },
  {
    id: 'meeting-003',
    title: 'Comité de validation — Campagne Q2',
    date: '22/05/2026',
    time: '15:30',
    location: 'Bureau principal',
    attendees: 6,
    status: 'upcoming',
  },
  {
    id: 'meeting-004',
    title: 'Séance extraordinaire — Budget',
    date: '28/05/2026',
    time: '09:00',
    location: 'Salle de conférence B',
    attendees: 10,
    status: 'upcoming',
  },
];

const DIRECTORY = [
  { id: 'dir-001', name: 'Dr. Bourama Kouyaté', role: 'Président', avatar: 'BK' },
  { id: 'dir-002', name: 'Mme. Aminata Diallo', role: 'Vice-Présidente', avatar: 'AM' },
  { id: 'dir-003', name: 'Amadou Diallo', role: 'Responsable Commission', avatar: 'AD' },
];

const STATUS_BADGE: Record<string, string> = {
  today: 'bg-primary/15 text-primary border-primary/30',
  tomorrow: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  upcoming: 'bg-muted text-muted-foreground border-border',
};
const STATUS_LABEL: Record<string, string> = {
  today: "Aujourd'hui",
  tomorrow: 'Demain',
  upcoming: 'À venir',
};

interface Props {
  onRequestAbsence: () => void;
}

export default function InfoPanel({ onRequestAbsence }: Props) {
  const [activeTab, setActiveTab] = useState<'meetings' | 'directory' | 'news'>('news');

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border flex-shrink-0">
        {([
          { key: 'news', label: 'Actualités', icon: Megaphone },
          { key: 'meetings', label: 'Réunions', icon: Calendar },
          { key: 'directory', label: 'Annuaire', icon: Users },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={`panel-tab-${key}`}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-600 border-b-2 transition-all duration-200 ${
              activeTab === key
                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === 'news' && <NewsPanel />}

        {activeTab === 'meetings' && (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-700 text-foreground uppercase tracking-wider">Prochaines réunions</h3>
              <span className="text-xs text-muted-foreground tabular-nums">{MEETINGS.length} planifiées</span>
            </div>

            {MEETINGS.map((meeting) => (
              <div
                key={meeting.id}
                className="p-3.5 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-xs font-600 text-foreground leading-snug flex-1">{meeting.title}</h4>
                  <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded-full border flex-shrink-0 ${STATUS_BADGE[meeting.status]}`}>
                    {STATUS_LABEL[meeting.status]}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Calendar size={11} className="flex-shrink-0" />
                    <span>{meeting.date}</span>
                    <Clock size={11} className="flex-shrink-0 ml-1" />
                    <span className="font-600 text-foreground">{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <FileText size={11} className="flex-shrink-0" />
                    <span className="truncate">{meeting.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Users size={11} className="flex-shrink-0" />
                    <span>{meeting.attendees} participants</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2.5 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <span>Voir l'ordre du jour</span>
                  <ChevronRight size={10} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'directory' && (
          <div className="p-4 space-y-3">
            <h3 className="text-xs font-700 text-foreground uppercase tracking-wider mb-3">Direction</h3>
            {DIRECTORY.map((person) => (
              <div key={person.id} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-200">
                <div className="w-9 h-9 rounded-full gradient-orange flex items-center justify-center text-primary-foreground font-800 text-xs flex-shrink-0">
                  {person.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-600 text-foreground truncate">{person.name}</p>
                  <p className="text-[10px] text-primary font-500 mt-0.5">{person.role}</p>
                </div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-border">
              <h3 className="text-xs font-700 text-foreground uppercase tracking-wider mb-3">Organigramme</h3>
              <div className="space-y-2">
                {[
                  { grade: 'Responsable', count: 1, color: 'text-yellow-400 bg-yellow-400/10' },
                  { grade: 'Adjoint', count: 3, color: 'text-blue-400 bg-blue-400/10' },
                  { grade: 'Membre', count: 8, color: 'text-muted-foreground bg-muted' },
                ].map((tier) => (
                  <div key={`tier-${tier.grade}`} className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                    <span className={`text-xs font-600 px-2 py-0.5 rounded-full ${tier.color}`}>{tier.grade}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{tier.count} membre{tier.count > 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Absence request CTA */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <button
          onClick={onRequestAbsence}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-primary/30 bg-primary/5 text-primary text-xs font-700 hover:bg-primary/10 transition-all duration-200 active:scale-[0.98]"
        >
          <Plus size={14} />
          Demande d'absence
        </button>
      </div>
    </div>
  );
}