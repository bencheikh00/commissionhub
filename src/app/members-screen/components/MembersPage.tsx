'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Users, Mail, Phone, Calendar } from 'lucide-react';
import { authService } from '@/lib/supabase/auth';

export default function MembersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
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
        email: user.email,
        phone: user.phone || 'Non renseigné',
        joinDate: new Date(user.join_date).getFullYear().toString(),
        avatar: `${user.prenom[0]}${user.nom[0]}`.toUpperCase(),
        status: user.status || 'offline',
      }));
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center">
                  <Users size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-700 text-foreground">Membres de la commission</h1>
                  <p className="text-sm text-muted-foreground">{members.length} membres actifs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un membre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full gradient-orange flex items-center justify-center text-primary-foreground font-800 text-lg">
                      {member.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card ${
                      member.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-700 text-foreground text-base mb-1">{member.name}</h3>
                    <p className="text-sm text-primary font-600 mb-3">{member.grade}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail size={14} />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone size={14} />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={14} />
                        <span>Membre depuis {member.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun membre trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
