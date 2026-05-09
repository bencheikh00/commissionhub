'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Crown, Calendar, Award } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function PresidentsPage() {
  const router = useRouter();
  const [presidents, setPresidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPresidents();
  }, []);

  const loadPresidents = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('presidents')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setPresidents(data || []);
    } catch (error) {
      console.error('Error loading presidents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center">
                <Crown size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-700 text-foreground">Anciens présidents</h1>
                <p className="text-sm text-muted-foreground">L'histoire de notre commission</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : (
          <>
            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

              <div className="space-y-8">
                {presidents.map((president, index) => (
                  <div key={president.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-8 top-8 w-4 h-4 rounded-full bg-primary border-4 border-background hidden md:block -translate-x-1/2" />

                    {/* Card */}
                    <div className="md:ml-20 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${president.color} flex items-center justify-center text-white font-800 text-xl flex-shrink-0`}>
                          {president.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="text-lg font-700 text-foreground mb-1">{president.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-primary font-600">
                                <Calendar size={14} />
                                <span>{president.year}</span>
                              </div>
                            </div>
                            {index === 0 && (
                              <span className="px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-700">
                                Récent
                              </span>
                            )}
                          </div>
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Award size={16} className="mt-0.5 flex-shrink-0" />
                            <p>{president.achievements}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl bg-card border border-border text-center">
                <div className="text-3xl font-800 text-primary mb-2">{presidents.length}</div>
                <div className="text-sm text-muted-foreground">Présidents</div>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border text-center">
                <div className="text-3xl font-800 text-primary mb-2">10+</div>
                <div className="text-sm text-muted-foreground">Années d'histoire</div>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border text-center">
                <div className="text-3xl font-800 text-primary mb-2">100+</div>
                <div className="text-sm text-muted-foreground">Projets réalisés</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
