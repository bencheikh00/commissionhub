// Test de connexion Supabase avec fetch
const supabaseUrl = 'https://xzqutvchttcajckacrzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cXV0dmNodHRjYWpja2Fjcnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTU2NTYsImV4cCI6MjA5MzkzMTY1Nn0.pNCd041mif8Am3O6l7R7PVXFchaoLvwhx6m2uzqT98M';

console.log('🔍 Test de connexion Supabase avec fetch...\n');

async function testConnection() {
  try {
    console.log('📊 Test 1: Récupération de tous les utilisateurs...');
    const response1 = await fetch(`${supabaseUrl}/rest/v1/users?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    const allUsers = await response1.json();
    console.log('✅ Succès! Nombre total d\'utilisateurs:', allUsers.length);
    console.log('Utilisateurs:');
    allUsers.forEach(u => {
      console.log(`  - ${u.prenom} ${u.nom} (${u.grade}, is_president: ${u.is_president})`);
    });

    console.log('\n📊 Test 2: Récupération des membres (is_president = false)...');
    const response2 = await fetch(`${supabaseUrl}/rest/v1/users?select=*&is_president=eq.false`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    const members = await response2.json();
    console.log('✅ Succès! Nombre de membres:', members.length);
    console.log('Membres:');
    members.forEach(u => {
      console.log(`  - ${u.prenom} ${u.nom} (${u.grade})`);
    });

    console.log('\n📊 Test 3: Récupération des présidents (is_president = true)...');
    const response3 = await fetch(`${supabaseUrl}/rest/v1/users?select=*&is_president=eq.true`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    const presidents = await response3.json();
    console.log('✅ Succès! Nombre de présidents:', presidents.length);
    console.log('Présidents:');
    presidents.forEach(u => {
      console.log(`  - ${u.prenom} ${u.nom} (Année: ${u.president_year})`);
    });

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testConnection();
