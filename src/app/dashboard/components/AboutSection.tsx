'use client';

import React, { useState, useEffect } from 'react';
import { aboutService } from '@/lib/supabase';

export default function AboutSection({ onClose }: { onClose: () => void }) {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const data = await aboutService.getAboutInfo();
      setAboutData(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-800 text-foreground flex items-center gap-2">
            <i className="bi bi-info-circle-fill text-primary"></i>
            À propos de la Commission
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <i className="bi bi-x-lg text-lg"></i>
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
              <div className="h-6 bg-muted rounded w-32 mb-3"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const values = aboutData?.values || [];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-800 text-foreground flex items-center gap-2">
            <i className="bi bi-info-circle-fill text-primary"></i>
            À propos de la Commission
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Découvrez notre mission, vision et histoire
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          <i className="bi bi-x-lg text-lg"></i>
        </button>
      </div>

      <div className="space-y-6">
        {/* Mission */}
        <div className="neon-card p-6 rounded-xl bg-card border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-neon-orange">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <i className="bi bi-bullseye text-2xl text-primary"></i>
            </div>
            <h3 className="text-xl font-800 text-foreground">Notre Mission</h3>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            {aboutData?.mission || 'Chargement...'}
          </p>
        </div>

        {/* Vision */}
        <div className="neon-card p-6 rounded-xl bg-card border-2 border-blue-400/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-neon-blue">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
              <i className="bi bi-eye-fill text-2xl text-blue-400"></i>
            </div>
            <h3 className="text-xl font-800 text-foreground">Notre Vision</h3>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            {aboutData?.vision || 'Chargement...'}
          </p>
        </div>

        {/* Histoire */}
        <div className="neon-card p-6 rounded-xl bg-card border-2 border-purple-400/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-neon-purple">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center">
              <i className="bi bi-clock-history text-2xl text-purple-400"></i>
            </div>
            <h3 className="text-xl font-800 text-foreground">Notre Histoire</h3>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            {aboutData?.history || 'Chargement...'}
          </p>
        </div>

        {/* Valeurs */}
        {values.length > 0 && (
          <div className="neon-card p-6 rounded-xl bg-card border-2 border-green-400/20 hover:border-green-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-400/10 flex items-center justify-center">
                <i className="bi bi-heart-fill text-2xl text-green-400"></i>
              </div>
              <h3 className="text-xl font-800 text-foreground">Nos Valeurs</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {values.map((value: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-green-400/10 border border-green-400/30 text-green-400 text-sm font-600"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
