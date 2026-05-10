'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/lib/supabase';
import ActivityChart from './ActivityChart';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    const [statsData, activityData] = await Promise.all([
      adminService.getAdminStats(),
      adminService.getRecentActivity(),
    ]);
    setStats(statsData);
    setActivity(activityData);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-6 animate-pulse">
            <div className="h-12 bg-white/10 rounded mb-4"></div>
            <div className="h-8 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    { label: 'Utilisateurs', value: stats?.totalUsers || 0, icon: 'bi-people-fill', color: 'blue', change: '+12%' },
    { label: 'En ligne', value: stats?.onlineUsers || 0, icon: 'bi-circle-fill', color: 'green', change: 'Maintenant' },
    { label: 'Absences en attente', value: stats?.pendingAbsences || 0, icon: 'bi-calendar-x', color: 'orange', change: 'À traiter' },
    { label: 'Tickets ouverts', value: stats?.openTickets || 0, icon: 'bi-exclamation-triangle', color: 'red', change: 'Urgent' },
    { label: 'Idées en attente', value: stats?.pendingIdeas || 0, icon: 'bi-lightbulb', color: 'purple', change: 'À réviser' },
    { label: 'Réunions à venir', value: stats?.upcomingMeetings || 0, icon: 'bi-calendar-event', color: 'cyan', change: 'Planifiées' },
    { label: 'Logos publiés', value: stats?.totalLogos || 0, icon: 'bi-image', color: 'pink', change: 'Disponibles' },
    { label: 'Activités 24h', value: stats?.activities24h || 0, icon: 'bi-activity', color: 'yellow', change: 'Dernières 24h' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all neon-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${card.color}-500/20 flex items-center justify-center`}>
                <i className={`${card.icon} text-2xl text-${card.color}-400`}></i>
              </div>
              <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">{card.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{card.value}</h3>
            <p className="text-sm text-white/60">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Graphique d'activités */}
      <ActivityChart />

      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="bi bi-clock-history text-primary"></i>
            Activité récente
          </h2>
          <button
            onClick={loadData}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all"
          >
            <i className="bi bi-arrow-clockwise mr-1"></i>
            Actualiser
          </button>
        </div>

        {activity.length === 0 ? (
          <div className="text-center py-12">
            <i className="bi bi-inbox text-6xl text-white/20 mb-4 block"></i>
            <p className="text-white/60">Aucune activité récente</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                {item.photo_url ? (
                  <img src={item.photo_url} alt={item.user_name} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-red-500 flex items-center justify-center text-white font-bold text-sm">
                    {item.avatar}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-semibold">{item.user_name}</span> {item.action}
                  </p>
                  <p className="text-white/60 text-xs">{item.entity_type}</p>
                </div>
                <span className="text-xs text-white/40">
                  {new Date(item.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
