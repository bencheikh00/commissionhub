'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/supabase/auth';

const STATUS_LABELS: Record<string, string> = { online: 'En ligne', offline: 'Hors ligne' };

interface Props {
  onClose: () => void;
}

export default function MembersSidebar({ onClose }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'online'>('all');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await authService.getAllUsers();
      const formattedMembers = data.map((user: any) => ({
        id: user.id,
        name: `${user.prenom} ${user.nom}`,
        grade: user.grade,
        avatar: `${user.prenom[0]}${user.nom[0]}`.toUpperCase(),
        status: user.status || 'offline',
        lastSeen: user.status === 'online' ? 'maintenant' : 'hors ligne',
      }));
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.status === 'online';
    return matchSearch && matchFilter;
  });

  const onlineCount = members.filter((m) => m.status === 'online').length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-700 text-foreground">Membres</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="text-green-400 font-600">{onlineCount}</span> en ligne · {members.length} total
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-xs text-muted-foreground">Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search size={20} className="text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">Aucun membre trouvé</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((member) => (
              <button
                key={member.id}
                onClick={() => router.push(`/profile?id=${member.id}`)}
                className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-muted/60 transition-all duration-150 group text-left"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-700 text-primary">
                    {member.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${
                    member.status === 'online' ? 'presence-online' : 'presence-offline'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-600 text-foreground truncate">{member.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{member.grade}</p>
                </div>
                <span className={`text-[10px] font-500 flex-shrink-0 ${
                  member.status === 'online' ? 'text-green-400' : 'text-muted-foreground'
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
