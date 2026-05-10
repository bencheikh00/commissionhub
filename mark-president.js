// Script pour marquer un utilisateur comme président
const supabaseUrl = 'https://xzqutvchttcajckacrzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cXV0dmNodHRjYWpja2Fjcnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTU2NTYsImV4cCI6MjA5MzkzMTY1Nn0.pNCd041mif8Am3O6l7R7PVXFchaoLvwhx6m2uzqT98M';

console.log('🔧 Script de marquage du président...\n');

// CONFIGURATION: Choisissez qui marquer comme président
const PRESIDENT_CONFIG = {
  prenom: 'ablaye',  // Changez ici
  nom: 'Gueye',      // Changez ici
  year: '2024-2025',
  achievements: 'Digitalisation de la commission, création de la plateforme CommissionHub',
  color: 'from-orange-500 to-red-500'
};

async function markAsPresident() {
  try {
    // 1. Récupérer tous les utilisateurs
    console.log('📊 Récupération des utilisateurs...');
    const response1 = await fetch(`${supabaseUrl}/rest/v1/users?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    const users = await response1.json();
    console.log('✅ Utilisateurs trouvés:', users.length);
    users.forEach((u, i) => {
      console.log(`  ${i+1}. ${u.prenom} ${u.nom} (${u.grade})`);
    });

    // 2. Trouver l'utilisateur à marquer
    const targetUser = users.find(u => 
      u.prenom.toLowerCase().trim() === PRESIDENT_CONFIG.prenom.toLowerCase().trim() && 
      u.nom.toLowerCase().trim() === PRESIDENT_CONFIG.nom.toLowerCase().trim()
    );

    if (!targetUser) {
      console.error(`\n❌ Utilisateur "${PRESIDENT_CONFIG.prenom} ${PRESIDENT_CONFIG.nom}" non trouvé!`);
      console.log('\n💡 Modifiez PRESIDENT_CONFIG dans le script avec le bon nom.');
      return;
    }

    console.log(`\n✅ Utilisateur trouvé: ${targetUser.prenom} ${targetUser.nom}`);
    console.log(`   ID: ${targetUser.id}`);

    // 3. Mettre à jour comme président
    console.log('\n🔄 Marquage comme président...');
    const response2 = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${targetUser.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        is_president: true,
        president_year: PRESIDENT_CONFIG.year,
        president_achievements: PRESIDENT_CONFIG.achievements,
        president_color: PRESIDENT_CONFIG.color
      })
    });

    if (response2.ok) {
      const updated = await response2.json();
      if (updated && updated.length > 0) {
        console.log('✅ Succès! Président marqué:');
        console.log(`   Nom: ${updated[0].prenom} ${updated[0].nom}`);
        console.log(`   Année: ${updated[0].president_year}`);
        console.log(`   is_president: ${updated[0].is_president}`);
        console.log('\n🎉 Vous pouvez maintenant relancer l\'application!');
      } else {
        console.log('✅ Mise à jour effectuée!');
        console.log('\n🎉 Vous pouvez maintenant relancer l\'application!');
      }
    } else {
      const error = await response2.text();
      console.error('❌ Erreur lors de la mise à jour:', error);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

markAsPresident();
