'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AdminTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    runDiagnostic();
  }, []);

  async function runDiagnostic() {
    const info: any = {};
    
    try {
      const sessionUser = sessionStorage.getItem('ch_user');
      info.sessionStorage = sessionUser ? JSON.parse(sessionUser) : null;
      
      const { data: admins } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'Admin');
      
      info.admins = admins || [];
      
      if (info.sessionStorage?.id) {
        const { data: currentUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', info.sessionStorage.id)
          .single();
        
        info.currentUser = currentUser;
        info.isAdmin = currentUser?.role === 'Admin';
      }
      
      setDebugInfo(info);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Diagnostic en cours...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-orange-500">🔍 Diagnostic Back-Office</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-bold mb-3">Utilisateur connecté</h2>
          <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.sessionStorage, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-bold mb-3">Admins ({debugInfo.admins?.length || 0})</h2>
          <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto max-h-60">
            {JSON.stringify(debugInfo.admins, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-bold mb-3">Statut</h2>
          {debugInfo.isAdmin ? (
            <div className="bg-green-500/20 border border-green-500 rounded p-4">
              <p className="font-bold text-green-400">✅ Vous êtes ADMIN</p>
            </div>
          ) : (
            <div className="bg-red-500/20 border border-red-500 rounded p-4">
              <p className="font-bold text-red-400">❌ Vous n'êtes PAS admin</p>
              <p className="text-sm mt-2">Exécutez dans Supabase SQL Editor:</p>
              <code className="block bg-gray-900 p-2 rounded mt-2 text-xs">
                UPDATE users SET role = 'Admin' WHERE email = 'votre-email';
              </code>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={runDiagnostic}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            🔄 Relancer
          </button>
          
          {debugInfo.isAdmin && (
            <button
              onClick={() => router.push('/admin')}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
            >
              ✅ Accéder au Back-Office
            </button>
          )}
          
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold"
          >
            ← Retour
          </button>
        </div>
      </div>
    </div>
  );
}
