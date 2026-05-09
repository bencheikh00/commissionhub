'use client';

import React, { useState, useEffect } from 'react';

const DAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export default function LockClock() {
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = String(now?.getHours())?.padStart(2, '0');
      const m = String(now?.getMinutes())?.padStart(2, '0');
      setTime(`${h}:${m}`);
      const day = DAYS_FR?.[now?.getDay()];
      const date = now?.getDate();
      const month = MONTHS_FR?.[now?.getMonth()];
      const year = now?.getFullYear();
      setDateStr(`${day} ${date} ${month} ${year}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="h-24" />;

  return (
    <div className="text-center">
      <div className="text-6xl font-800 text-foreground tabular-nums tracking-tight leading-none">
        {time}
      </div>
      <div className="text-sm text-muted-foreground font-500 mt-2 capitalize">
        {dateStr}
      </div>
    </div>
  );
}