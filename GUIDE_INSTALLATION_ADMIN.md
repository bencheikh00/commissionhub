# 📖 GUIDE D'INSTALLATION BACK-OFFICE ADMIN
## Étape par Étape avec Captures d'Écran

---

## 🎯 ÉTAPE 1 : Exécuter le Schéma SQL

### Qu'est-ce que c'est ?
Le fichier `admin-backoffice-schema.sql` contient toutes les instructions SQL pour :
- Ajouter la colonne `role` à la table `users`
- Créer la table `logos` pour les médias
- Configurer les permissions de sécurité (RLS)
- Créer les triggers de notification automatique

### Comment faire ?

#### 1.1 - Ouvrir Supabase Dashboard
1. Aller sur [https://supabase.com](https://supabase.com)
2. Se connecter à votre compte
3. Sélectionner votre projet **CommissionHub**

#### 1.2 - Accéder au SQL Editor
```
Dans le menu latéral gauche :
┌─────────────────────────┐
│ 🏠 Home                 │
│ 📊 Table Editor         │
│ 🔍 SQL Editor          │ ← CLIQUER ICI
│ 🗄️  Database            │
│ 🔐 Authentication       │
│ 📁 Storage              │
└─────────────────────────┘
```

#### 1.3 - Créer une nouvelle requête
1. Cliquer sur le bouton **"+ New query"** en haut à droite
2. Une nouvelle fenêtre d'éditeur SQL s'ouvre

#### 1.4 - Copier le contenu du fichier
1. Ouvrir le fichier `admin-backoffice-schema.sql` dans votre éditeur de code (VS Code)
2. Sélectionner TOUT le contenu (Ctrl+A ou Cmd+A)
3. Copier (Ctrl+C ou Cmd+C)

#### 1.5 - Coller dans Supabase SQL Editor
1. Retourner dans Supabase SQL Editor
2. Coller le contenu dans la zone de texte (Ctrl+V ou Cmd+V)
3. Vous devriez voir tout le code SQL

#### 1.6 - Exécuter le script
1. Cliquer sur le bouton **"RUN"** (ou appuyer sur Ctrl+Enter)
2. Attendre quelques secondes
3. Vérifier les messages de succès en bas :

```
✅ Success. No rows returned
✅ CommissionHub Database Schema Created Successfully!
✅ Tables: users, absences, ideas, support_tickets, notifications, activity_logs
✅ RLS Policies: Enabled with secure access control
```

#### 1.7 - Vérifier que tout est créé
Dans le menu latéral, aller sur **"Table Editor"** :
```
Vous devriez voir les tables :
- users (avec nouvelle colonne "role")
- logos (nouvelle table)
- absences
- ideas
- support_tickets
- notifications
- activity_logs
- meetings
- about_commission
```

---

## 🗂️ ÉTAPE 2 : Créer le Bucket Storage "logos"

### Qu'est-ce que c'est ?
Un bucket storage est un espace de stockage pour les fichiers (images, documents, etc.). Le bucket `logos` va stocker tous les logos uploadés par les admins.

### Comment faire ?

#### 2.1 - Accéder à Storage
```
Dans le menu latéral gauche :
┌─────────────────────────┐
│ 🏠 Home                 │
│ 📊 Table Editor         │
│ 🔍 SQL Editor           │
│ 🗄️  Database            │
│ 🔐 Authentication       │
│ 📁 Storage             │ ← CLIQUER ICI
└─────────────────────────┘
```

#### 2.2 - Créer un nouveau bucket
1. Cliquer sur le bouton **"Create a new bucket"** ou **"New bucket"**
2. Une fenêtre modale s'ouvre

#### 2.3 - Configurer le bucket
```
┌─────────────────────────────────────┐
│  Create a new bucket                │
├─────────────────────────────────────┤
│                                     │
│  Name of bucket *                   │
│  ┌───────────────────────────────┐ │
│  │ logos                         │ │ ← TAPER "logos"
│  └───────────────────────────────┘ │
│                                     │
│  ☑️ Public bucket                   │ ← COCHER CETTE CASE
│                                     │
│  [Cancel]  [Create bucket]          │
└─────────────────────────────────────┘
```

**IMPORTANT** : Cocher **"Public bucket"** pour que les logos soient accessibles publiquement

#### 2.4 - Cliquer sur "Create bucket"
Le bucket `logos` apparaît maintenant dans la liste :
```
Storage > Buckets
┌─────────────────────────┐
│ 📁 avatars (public)     │
│ 📁 logos (public)       │ ← NOUVEAU BUCKET
└─────────────────────────┘
```

#### 2.5 - Vérifier les policies (optionnel)
1. Cliquer sur le bucket `logos`
2. Aller dans l'onglet **"Policies"**
3. Vous devriez voir les policies créées automatiquement par le script SQL :
   - ✅ Public read access for logos
   - ✅ Admins can upload logos
   - ✅ Admins can update logos
   - ✅ Admins can delete logos

---

## 👤 ÉTAPE 3 : Promouvoir un Utilisateur en Admin

### Qu'est-ce que c'est ?
Par défaut, tous les utilisateurs ont le rôle `User`. Pour accéder au back-office, vous devez promouvoir au moins un utilisateur au rôle `Admin`.

### Comment faire ?

#### 3.1 - Retourner au SQL Editor
```
Dans le menu latéral gauche :
┌─────────────────────────┐
│ 🔍 SQL Editor          │ ← CLIQUER ICI
└─────────────────────────┘
```

#### 3.2 - Créer une nouvelle requête
1. Cliquer sur **"+ New query"**

#### 3.3 - Copier cette commande SQL
```sql
-- Promouvoir un utilisateur en Admin
UPDATE public.users 
SET role = 'Admin' 
WHERE email = 'votre-email@example.com';
```

**IMPORTANT** : Remplacer `votre-email@example.com` par l'email de votre compte

#### 3.4 - Exemple concret
Si votre email est `admin@commissionhub.com` :
```sql
UPDATE public.users 
SET role = 'Admin' 
WHERE email = 'admin@commissionhub.com';
```

#### 3.5 - Exécuter la commande
1. Cliquer sur **"RUN"**
2. Vous devriez voir :
```
✅ Success. 1 row(s) affected
```

#### 3.6 - Vérifier la promotion
1. Aller dans **"Table Editor"**
2. Cliquer sur la table **"users"**
3. Chercher votre utilisateur
4. Vérifier que la colonne **"role"** affiche maintenant **"Admin"**

```
Table: users
┌──────────────────────────┬──────────┬──────────┬───────┐
│ email                    │ prenom   │ nom      │ role  │
├──────────────────────────┼──────────┼──────────┼───────┤
│ admin@commissionhub.com  │ Admin    │ Hub      │ Admin │ ← VÉRIFIÉ
│ user@example.com         │ John     │ Doe      │ User  │
└──────────────────────────┴──────────┴──────────┴───────┘
```

---

## 🚀 ÉTAPE 4 : Accéder au Back-Office

### Comment faire ?

#### 4.1 - Lancer le serveur de développement
Dans votre terminal :
```bash
cd commissionhub
npm run dev
```

#### 4.2 - Se connecter avec le compte Admin
1. Ouvrir [http://localhost:4028](http://localhost:4028)
2. Se connecter avec l'email que vous avez promu en Admin
3. Entrer votre mot de passe

#### 4.3 - Accéder au Back-Office
1. Une fois connecté, aller sur [http://localhost:4028/admin](http://localhost:4028/admin)
2. Ou depuis le dashboard, ajouter `/admin` à l'URL

#### 4.4 - Vérification de l'accès
Si tout est correct, vous devriez voir :
```
┌─────────────────────────────────────────────────┐
│ 🔐 Back-Office Admin                            │
│    Contrôle total de la plateforme              │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Dashboard] [Utilisateurs] [Logos]             │
│  [Absences]  [Tickets]      [Réunions]          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ❌ Problèmes Courants

### Problème 1 : "Access denied" ou redirection vers /dashboard
**Cause** : Votre utilisateur n'a pas le rôle Admin

**Solution** :
1. Vérifier dans Supabase Table Editor → users
2. Vérifier que la colonne `role` = `Admin`
3. Si ce n'est pas le cas, refaire l'ÉTAPE 3

### Problème 2 : "Cannot upload logo"
**Cause** : Le bucket `logos` n'existe pas ou n'est pas public

**Solution** :
1. Aller dans Supabase Storage
2. Vérifier que le bucket `logos` existe
3. Vérifier qu'il est marqué comme **"public"**
4. Si non, supprimer et recréer avec l'option "Public bucket" cochée

### Problème 3 : "Table logos does not exist"
**Cause** : Le script SQL n'a pas été exécuté correctement

**Solution** :
1. Retourner dans SQL Editor
2. Réexécuter le fichier `admin-backoffice-schema.sql`
3. Vérifier les messages d'erreur
4. Si erreur, copier l'erreur et la corriger

### Problème 4 : Notifications ne s'affichent pas
**Cause** : Le trigger `notify_new_meeting` n'est pas actif

**Solution** :
1. Dans SQL Editor, exécuter :
```sql
SELECT * FROM pg_trigger WHERE tgname = 'trigger_notify_new_meeting';
```
2. Si aucun résultat, réexécuter le script SQL

---

## ✅ Checklist Finale

Avant de commencer à utiliser le back-office, vérifier :

- [ ] ✅ Script SQL exécuté sans erreur
- [ ] ✅ Colonne `role` existe dans la table `users`
- [ ] ✅ Table `logos` créée
- [ ] ✅ Bucket storage `logos` créé et public
- [ ] ✅ Au moins un utilisateur a `role = 'Admin'`
- [ ] ✅ Connexion avec le compte Admin réussie
- [ ] ✅ Accès à `/admin` fonctionne
- [ ] ✅ Dashboard affiche les statistiques

---

## 🎓 Résumé Visuel

```
INSTALLATION BACK-OFFICE ADMIN
═══════════════════════════════════════════════════════════

1️⃣  SUPABASE SQL EDITOR
    ↓
    Copier admin-backoffice-schema.sql
    ↓
    Coller dans SQL Editor
    ↓
    Cliquer RUN
    ↓
    ✅ Tables créées

2️⃣  SUPABASE STORAGE
    ↓
    Cliquer "New bucket"
    ↓
    Nom: "logos"
    ↓
    Cocher "Public bucket"
    ↓
    ✅ Bucket créé

3️⃣  SUPABASE SQL EDITOR
    ↓
    UPDATE users SET role = 'Admin' WHERE email = '...';
    ↓
    Cliquer RUN
    ↓
    ✅ Admin promu

4️⃣  NAVIGATEUR
    ↓
    http://localhost:4028/admin
    ↓
    ✅ Back-Office accessible

═══════════════════════════════════════════════════════════
```

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier la checklist ci-dessus
2. Consulter la section "Problèmes Courants"
3. Vérifier les logs dans la console du navigateur (F12)
4. Vérifier les logs Supabase dans le SQL Editor

**Développé avec 🧡 par SBCS**
