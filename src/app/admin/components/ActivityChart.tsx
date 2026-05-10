'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { adminService } from '@/lib/supabase';

const COLORS = ['#FF6B35', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

export default function ActivityChart() {
  const [activityData, setActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivityData();
    const interval = setInterval(loadActivityData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  async function loadActivityData() {
    try {
      console.log('📊 Chargement des activités...');
      const activity = await adminService.getRecentActivity();
      console.log('✅ Activités récupérées:', activity.length, 'entrées');
      
      // Grouper par heure
      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}h`,
        count: 0
      }));

      activity.forEach((item: any) => {
        const hour = new Date(item.created_at).getHours();
        hourlyData[hour].count++;
      });

      // Prendre seulement les 12 dernières heures
      const currentHour = new Date().getHours();
      const last12Hours = [];
      for (let i = 11; i >= 0; i--) {
        const hour = (currentHour - i + 24) % 24;
        last12Hours.push(hourlyData[hour]);
      }

      console.log('📈 Données des 12 dernières heures:', last12Hours);
      console.log('🔢 Total activités:', last12Hours.reduce((sum, item) => sum + item.count, 0));
      
      setActivityData(last12Hours);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error loading activity data:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
        <div className="h-64 bg-white/5 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 neon-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="bi bi-graph-up text-primary"></i>
            Activités des 12 dernières heures
          </h2>
          <p className="text-sm text-white/60 mt-1">Mise à jour en temps réel</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-semibold">LIVE</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={activityData}>
          <defs>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="hour" 
            stroke="rgba(255,255,255,0.6)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,107,53,0.5)',
              borderRadius: '8px',
              color: '#fff'
            }}
            labelStyle={{ color: '#FF6B35' }}
          />
          <Bar 
            dataKey="count" 
            fill="url(#colorActivity)" 
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <i className="bi bi-arrow-up-circle text-green-400 text-2xl mb-2 block"></i>
          <p className="text-2xl font-bold text-white">
            {activityData.reduce((sum, item) => sum + item.count, 0)}
          </p>
          <p className="text-xs text-white/60">Total activités</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <i className="bi bi-graph-up text-blue-400 text-2xl mb-2 block"></i>
          <p className="text-2xl font-bold text-white">
            {Math.max(...activityData.map(d => d.count))}
          </p>
          <p className="text-xs text-white/60">Pic d'activité</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <i className="bi bi-clock text-orange-400 text-2xl mb-2 block"></i>
          <p className="text-2xl font-bold text-white">
            {(activityData.reduce((sum, item) => sum + item.count, 0) / 12).toFixed(1)}
          </p>
          <p className="text-xs text-white/60">Moyenne/heure</p>
        </div>
      </div>
    </div>
  );
}
