'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const MEMBERS = [
  { id: 'member-001', name: 'Amadou Diallo', grade: 'Responsable', avatar: 'AD', status: 'online', lastSeen: 'maintenant' },
  { id: 'member-002', name: 'Fatoumata Koné', grade: 'Adjoint', avatar: 'FK', status: 'online', lastSeen: 'maintenant' },
  { id: 'member-003', name: 'Ibrahim Traoré', grade: 'Membre', avatar: 'IT', status: 'online', lastSeen: 'maintenant' },
  { id: 'member-004', name: 'Mariam Coulibaly', grade: 'Membre', avatar: 'MC', status: 'away', lastSeen: 'il y a 5 min' },
  { id: 'member-005', name: 'Ousmane Bah', grade: 'Adjoint', avatar: 'OB', status: 'online', lastSeen: 'maintenant' },
  { id: 'member-006', name: 'Aïssatou Baldé', grade: 'Membre', avatar: 'AB', status: 'offline', lastSeen: 'il y a 2h' },
  { id: 'member-007', name: 'Mamadou Sylla', grade: 'Membre', avatar: 'MS', status: 'online', lastSeen: 'maintenant' },
  { id: 'member-008', name: 'Kadiatou Barry', grade: 'Membre', avatar: 'KB', status: 'away', lastSeen: 'il y a 12 min' },
  { id: 'member-009', name: 'Sekou Camara', grade: 'Membre', avatar: 'SC', status: 'offline', lastSeen: 'hier' },
  { id: 'member-010', name: 'Hawa Diallo', grade: 'Membre', avatar: 'HD', status: 'online', lastSeen: 'maintenant' },
  { id: 'member-011', name: 'Boubacar Sow', grade: 'Membre', avatar: 'BS', status: 'offline', lastSeen: 'il y a 3h' },
  { id: 'member-012', name: 'Nènè Kourouma', grade: 'Membre', avatar: 'NK', status: 'online', lastSeen: 'maintenant' },
];

const STATUS_LABELS: Record<string, string> = { online: 'En ligne', away: 'Absent', offline: 'Hors ligne' };

interface Props {
  onClose: () => void;
}

export default function MembersSidebar({ onClose }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'online'>('all');

  const filtered = MEMBERS.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.status === 'online';
    return matchSearch && matchFilter;
  });

  const onlineCount = MEMBERS.filter((m) => m.status === 'online').length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-700 text-foreground">Membres</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="text-green-400 font-600">{onlineCount}</span> en ligne · {MEMBERS.length} total
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors duration-150"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-0.5 bg-background rounded-lg">
          {(['all', 'online'] as const).map((f) => (
            <button
              key={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 text-xs font-600 rounded-md transition-all duration-150 ${
                filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'Tous' : 'En ligne'}
            </button>
          ))}
        </div>
      </div>

      {/* Member list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search size={20} className="text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">Aucun membre trouvé</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((member) => (
              <button
                key={member.id}
                className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-muted/60 transition-all duration-150 group text-left"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-700 text-primary">
                    {member.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${
                    member.status === 'online' ? 'presence-online' : member.status === 'away' ? 'presence-away' : 'presence-offline'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-600 text-foreground truncate">{member.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{member.grade}</p>
                </div>
                <span className={`text-[10px] font-500 flex-shrink-0 ${
                  member.status === 'online' ? 'text-green-400' : member.status === 'away' ? 'text-yellow-400' : 'text-muted-foreground'
                }`}>
                  {STATUS_LABELS[member.status]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}