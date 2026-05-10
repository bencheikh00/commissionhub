// Script pour FORCER la mise à jour du président via API REST
const supabaseUrl = 'https://xzqutvchttcajckacrzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cXV0dmNodHRjYWpja2Fjcnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTU2NTYsImV4cCI6MjA5MzkzMTY1Nn0.pNCd041mif8Am3O6l7R7PVXFchaoLvwhx6m2uzqT98M';

console.log('🔧 FORCER la mise à jour du président...\n');

async function forceUpdatePresident() {
  try {
    // 1. Récupérer ablaye Gueye
    console.log('📊 Recherche de ablaye Gueye...');
    const response1 = await fetch(`${supabaseUrl}/rest/v1/users?select=*&prenom=ilike.*ablaye*&nom=ilike.*Gueye*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    const users = await response1.json();
    
    if (!users || users.length === 0) {
      console.error('❌ Utilisateur non trouvé!');
      return;
    }

    const user = users[0];
    console.log('✅ Utilisateur trouvé:', user.prenom, user.nom);
    console.log('   ID:', user.id);
    console.log('   is_president actuel:', user.is_president);

    // 2. Mise à jour FORCÉE
    console.log('\n🔄 Mise à jour FORCÉE...');
    const response2 = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${user.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        is_president: true,
        president_year: '2024-2025',
        president_achievements: 'Digitalisation de la commission, création de la plateforme CommissionHub',
        president_color: 'from-orange-500 to-red-500'
      })
    });

    const responseText = await response2.text();
    console.log('Réponse brute:', responseText);

    if (response2.ok) {
      console.log('\n✅ Mise à jour réussie!');
      
      // 3. Vérification immédiate
      console.log('\n🔍 Vérification...');
      const response3 = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${user.id}`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      const updated = await response3.json();
      console.log('✅ Données après mise à jour:');
      console.log('   is_president:', updated[0].is_president);
      console.log('   president_year:', updated[0].president_year);
      console.log('   president_achievements:', updated[0].president_achievements);
      
      if (updated[0].is_president === true) {
        console.log('\n🎉 SUCCÈS! Le président est maintenant marqué correctement!');
        console.log('   Relancez l\'application: npm run dev');
      } else {
        console.log('\n⚠️ La mise à jour n\'a pas fonctionné. Problème de RLS Policy.');
        console.log('   Utilisez le script SQL mark-president.sql dans Supabase Dashboard');
      }
    } else {
      console.error('\n❌ Erreur HTTP:', response2.status, response2.statusText);
      console.log('⚠️ Les RLS policies bloquent la mise à jour.');
      console.log('   Solution: Exécutez mark-president.sql dans Supabase SQL Editor');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

forceUpdatePresident();
