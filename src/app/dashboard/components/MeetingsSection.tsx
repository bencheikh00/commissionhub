'use client';

import React, { useState, useEffect } from 'react';
import { meetingService } from '@/lib/supabase';

export default function MeetingsSection({ onClose }: { onClose: () => void }) {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetings();
    
    // Polling toutes les 5 secondes pour temps réel
    const interval = setInterval(loadMeetings, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMeetings = async () => {
    try {
      const data = await meetingService.getUpcomingMeetings();
      setMeetings(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-800 text-foreground flex items-center gap-2">
            <i className="bi bi-calendar-event-fill text-primary"></i>
            Réunions à venir
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <i className="bi bi-x-lg text-lg"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-800 text-foreground flex items-center gap-2">
            <i className="bi bi-calendar-event-fill text-primary"></i>
            Réunions à venir
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {meetings.length} réunion{meetings.length > 1 ? 's' : ''} programmée{meetings.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          <i className="bi bi-x-lg text-lg"></i>
        </button>
      </div>

      {meetings.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse-slow">
            <i className="bi bi-calendar-x text-6xl text-primary/50"></i>
          </div>
          <h3 className="text-xl font-700 text-foreground mb-2">Aucune réunion programmée</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Il n'y a actuellement aucune réunion à venir. Les prochaines réunions apparaîtront ici dès qu'elles seront planifiées.
          </p>
        </div>
      ) : (
        /* Meetings Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((meeting, index) => (
            <div
              key={meeting.id}
              className="neon-card p-6 rounded-xl bg-card border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-neon-orange animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-800 text-foreground mb-2 line-clamp-2">
                    {meeting.title}
                  </h3>
                  {meeting.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {meeting.description}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 ml-3">
                  <i className="bi bi-calendar-event text-xl text-primary"></i>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <i className="bi bi-calendar3 text-primary"></i>
                  <span className="text-foreground font-600">
                    {formatDate(meeting.meeting_date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="bi bi-clock text-primary"></i>
                  <span className="text-foreground font-600">
                    {formatTime(meeting.meeting_date)}
                  </span>
                </div>
                {meeting.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <i className="bi bi-geo-alt text-primary"></i>
                    <span className="text-muted-foreground">{meeting.location}</span>
                  </div>
                )}
              </div>

              {/* Agenda */}
              {meeting.agenda && Array.isArray(meeting.agenda) && meeting.agenda.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <i className="bi bi-list-check text-primary text-sm"></i>
                    <span className="text-xs font-700 text-foreground uppercase tracking-wider">
                      Ordre du jour
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {meeting.agenda.slice(0, 3).map((item: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="text-muted-foreground flex-1">
                          {typeof item === 'string' ? item : item.title || item.text}
                        </span>
                      </li>
                    ))}
                    {meeting.agenda.length > 3 && (
                      <li className="text-xs text-primary font-600">
                        +{meeting.agenda.length - 3} autre{meeting.agenda.length - 3 > 1 ? 's' : ''} point{meeting.agenda.length - 3 > 1 ? 's' : ''}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-600">
                  <i className="bi bi-check-circle-fill"></i>
                  Programmée
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
