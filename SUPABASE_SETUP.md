# 🔗 Guide d'intégration Supabase

## ✅ Ce qui a été fait

### 1. Installation
- ✅ Package `@supabase/supabase-js` installé
- ✅ Client Supabase configuré dans `src/lib/supabase/client.tsx`
- ✅ Service d'authentification créé dans `src/lib/supabase/auth.ts`

### 2. Fichiers modifiés
- ✅ `LoginForm.tsx` - Connexion avec Supabase
- ✅ `RegisterForm.tsx` - Inscription avec upload photo
- ✅ `MembersPage.tsx` - Récupération des membres depuis DB
- ✅ `PresidentsPage.tsx` - Récupération des présidents depuis DB

### 3. Schéma de base de données
- ✅ Fichier SQL créé : `supabase-schema.sql`

---

## 🚀 Étapes pour activer Supabase

### Étape 1 : Créer les tables dans Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre projet (URL déjà dans `.env`)
3. Allez dans **SQL Editor**
4. Copiez tout le contenu du fichier `supabase-schema.sql`
5. Collez et exécutez le SQL

### Étape 2 : Créer le bucket de stockage pour les photos

1. Dans Supabase, allez dans **Storage**
2. Créez un nouveau bucket nommé : `avatars`
3. Rendez-le **public** :
   - Cliquez sur le bucket `avatars`
   - Allez dans **Policies**
   - Créez une policy :
     ```sql
     CREATE POLICY "Public Access"
     ON storage.objects FOR SELECT
     USING ( bucket_id = 'avatars' );
     
     CREATE POLICY "Authenticated users can upload"
     ON storage.objects FOR INSERT
     WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
     ```

### Étape 3 : Vérifier les variables d'environnement

Vérifiez que `.env` contient :
```env
NEXT_PUBLIC_SUPABASE_URL=https://rvmygaspdngcbuhxtctv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Étape 4 : Redémarrer le serveur

```bash
npm run dev
```

---

## 📊 Structure de la base de données

### Table `users`
- Stocke tous les membres de la commission
- Champs : email, password_hash, prenom, nom, grade, photo_url, was_president, president_year, phone, status

### Table `presidents`
- Stocke l'historique des présidents
- Champs : name, year, avatar, achievements, color

### Table `messages`
- Pour le chat (à implémenter)
- Champs : user_id, content, created_at

### Table `absences`
- Pour les demandes d'absence
- Champs : user_id, start_date, end_date, reason, status

---

## 🔐 Sécurité

### Row Level Security (RLS)
- ✅ Activé sur toutes les tables
- ✅ Policies configurées pour lecture publique
- ✅ Insertion limitée aux utilisateurs authentifiés

### Hashing des mots de passe
⚠️ **IMPORTANT** : Le hashing actuel utilise `btoa()` (base64) pour la démo.

**Pour la production**, remplacez dans `src/lib/supabase/auth.ts` :
```typescript
// Installer bcrypt
npm install bcryptjs
npm install --save-dev @types/bcryptjs

// Remplacer les fonctions
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

---

## 🧪 Test de l'intégration

### 1. Inscription
1. Allez sur `http://localhost:4028`
2. Cliquez sur "Inscription"
3. Remplissez le formulaire avec une photo
4. Vérifiez dans Supabase :
   - Table `users` → nouveau membre
   - Storage `avatars` → photo uploadée

### 2. Connexion
1. Utilisez l'email et mot de passe créés
2. Vous devriez être redirigé vers `/lock-screen`

### 3. Voir les membres
1. Cliquez sur le menu (3 traits)
2. "Voir les membres"
3. Tous les membres de la DB s'affichent

### 4. Anciens présidents
1. Menu → "Anciens présidents"
2. Les 5 présidents insérés par défaut s'affichent

---

## 🐛 Dépannage

### Erreur : "Failed to fetch"
- Vérifiez que les variables d'environnement sont correctes
- Redémarrez le serveur après modification du `.env`

### Erreur : "Storage bucket not found"
- Créez le bucket `avatars` dans Supabase Storage
- Vérifiez qu'il est public

### Erreur : "Row Level Security"
- Exécutez le SQL complet dans `supabase-schema.sql`
- Vérifiez que les policies sont créées

---

## 📝 Prochaines étapes

1. ✅ Implémenter le chat en temps réel avec Supabase Realtime
2. ✅ Ajouter la gestion des absences
3. ✅ Améliorer le hashing des mots de passe (bcrypt)
4. ✅ Ajouter l'authentification par email (Supabase Auth)
5. ✅ Implémenter les notifications en temps réel

---

Besoin d'aide ? Consultez la [documentation Supabase](https://supabase.com/docs)
