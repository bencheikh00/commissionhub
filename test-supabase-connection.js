// Test de connexion Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzqutvchttcajckacrzy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cXV0dmNodHRjYWpja2Fjcnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTU2NTYsImV4cCI6MjA5MzkzMTY1Nn0.pNCd041mif8Am3O6l7R7PVXFchaoLvwhx6m2uzqT98M';

console.log('🔍 Test de connexion Supabase...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...\n');

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    enabled: false
  }
});

async function testConnection() {
  try {
    console.log('📊 Test 1: Récupération de tous les utilisateurs...');
    const { data: allUsers, error: allError } = await supabase
      .from('users')
      .select('*');
    
    if (allError) {
      console.error('❌ Erreur:', allError);
    } else {
      console.log('✅ Succès! Nombre total d\'utilisateurs:', allUsers.length);
      console.log('Utilisateurs:', allUsers.map(u => `${u.prenom} ${u.nom} (${u.grade}, is_president: ${u.is_president})`));
    }

    console.log('\n📊 Test 2: Récupération des membres (is_president = false)...');
    const { data: members, error: membersError } = await supabase
      .from('users')
      .select('*')
      .eq('is_president', false);
    
    if (membersError) {
      console.error('❌ Erreur:', membersError);
    } else {
      console.log('✅ Succès! Nombre de membres:', members.length);
      console.log('Membres:', members.map(u => `${u.prenom} ${u.nom} (${u.grade})`));
    }

    console.log('\n📊 Test 3: Récupération des présidents (is_president = true)...');
    const { data: presidents, error: presidentsError } = await supabase
      .from('users')
      .select('*')
      .eq('is_president', true);
    
    if (presidentsError) {
      console.error('❌ Erreur:', presidentsError);
    } else {
      console.log('✅ Succès! Nombre de présidents:', presidents.length);
      console.log('Présidents:', presidents.map(u => `${u.prenom} ${u.nom} (Année: ${u.president_year})`));
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testConnection();
