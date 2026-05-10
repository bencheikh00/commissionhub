# 🔐 BACK-OFFICE ADMINISTRATEUR - Documentation Complète

## 📋 Vue d'ensemble

Interface d'administration complète avec **contrôle total** de la plateforme CommissionHub. Accès strictement réservé aux utilisateurs avec le rôle **Admin** via Row Level Security (RLS) de Supabase.

---

## 🚀 Installation

### 1. Exécuter le schéma SQL Admin

Dans **Supabase SQL Editor**, exécuter le fichier :
```sql
admin-backoffice-schema.sql
```

Ce script va :
- ✅ Ajouter la colonne `role` (Admin/User) à la table `users`
- ✅ Créer la table `logos` pour la gestion des médias
- ✅ Créer le bucket storage `logos` (public)
- ✅ Configurer les RLS policies strictes (admins uniquement)
- ✅ Créer les triggers de notification pour les réunions
- ✅ Créer les vues et fonctions admin

### 2. Créer le bucket Storage

Dans **Supabase Dashboard → Storage** :
1. Créer un bucket : `logos`
2. Rendre le bucket **public**
3. Vérifier les policies (déjà créées par le script SQL)

### 3. Promouvoir un utilisateur en Admin

Dans **Supabase SQL Editor** :
```sql
UPDATE public.users 
SET role = 'Admin' 
WHERE email = 'votre-email@example.com';
```

### 4. Accéder au Back-Office

URL : `http://localhost:4028/admin`

**Protection automatique** :
- Redirection vers `/` si non authentifié
- Redirection vers `/dashboard` si role ≠ Admin

---

## 🎯 Fonctionnalités

### 1️⃣ Dashboard Admin (Vue d'ensemble)

**Statistiques en temps réel** :
- 📊 Nombre total d'utilisateurs
- 🟢 Utilisateurs en ligne
- 📅 Absences en attente
- 🚨 Tickets ouverts
- 💡 Idées en attente
- 📆 Réunions à venir
- 🖼️ Logos publiés
- ⚡ Activités dernières 24h

**Activité récente** :
- Flux en temps réel des actions utilisateurs
- Actualisation automatique toutes les 30 secondes
- Affichage des 20 dernières activités

---

### 2️⃣ Gestion des Utilisateurs (CRUD Complet)

**Fonctionnalités** :
- ✅ **Lire** : Liste complète avec recherche
- ✅ **Modifier** : Prénom, nom, email, grade, rôle, téléphone
- ✅ **Supprimer** : Suppression définitive (cascade automatique)
- ✅ **Changer grade** : Tous les grades disponibles
- ✅ **Promouvoir Admin** : Changer role User → Admin

**Informations affichées** :
- Photo de profil / Avatar
- Nom complet + Email
- Grade + Rôle (Admin/User)
- Statut (online/away/offline)
- Téléphone
- Date d'inscription

**Protection** :
- Impossible de supprimer son propre compte
- Impossible de supprimer un autre admin (via fonction SQL)

---

### 3️⃣ Gestion des Logos (Médias)

**Upload de logos** :
- ✅ Formulaire d'upload avec preview
- ✅ Nom, description, catégorie (Officiel/Événement/Social)
- ✅ Upload vers Supabase Storage (bucket `logos`)
- ✅ Enregistrement dans la table `logos`

**Affichage** :
- Grid responsive (1-2-3 colonnes)
- Preview de l'image
- Informations : nom, description, catégorie, type, taille
- Compteur de téléchargements

**Actions** :
- Supprimer un logo (fichier + entrée DB)
- Les logos s'affichent automatiquement côté Front-End

---

### 4️⃣ Gestion des Absences

**Réception des demandes** :
- Liste complète avec filtres (Toutes/En attente/Approuvées/Rejetées)
- Informations utilisateur (photo, nom, grade)
- Dates (du → au)
- Raison de l'absence

**Actions** :
- ✅ **Approuver** : Marquer comme approuvée
- ✅ **Rejeter** : Marquer comme rejetée
- ✅ **Supprimer** : Supprimer définitivement
- Enregistrement automatique de l'admin qui a traité (reviewed_by)

---

### 5️⃣ Gestion des Tickets de Support

**Réception des signalements** :
- Liste avec filtres (Tous/Ouverts/En cours/Résolus/Fermés)
- Priorité (Basse/Moyenne/Haute/Urgent)
- Informations utilisateur (photo, nom, email)
- Sujet + Message complet

**Workflow** :
1. **Ouvert** → Prendre en charge → **En cours**
2. **En cours** → Marquer résolu → **Résolu**
3. **Résolu** → Fermer → **Fermé**

**Actions** :
- Changer le statut
- Assigner à un admin (assigned_to)
- Supprimer le ticket

---

### 6️⃣ Gestion des Réunions + Notifications

**Création de réunions** :
- Titre, description
- Date et heure
- Lieu
- Ordre du jour (points multiples)

**Notification automatique** :
- 🔔 **Trigger SQL** : Lors de la création d'une réunion
- 📢 **Notification push** envoyée à **TOUS les utilisateurs**
- Message : "📅 Nouvelle réunion programmée - [Titre] - [Date]"
- Affichage dans le Front-End (notifications)

**Actions** :
- Créer une réunion
- Modifier une réunion
- Supprimer une réunion
- Statuts : Planifiée/En cours/Terminée/Annulée

---

## 🛡️ Sécurité (RLS Policies)

### Policies strictes

**Table `users`** :
```sql
-- Seuls les admins peuvent modifier/supprimer
CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ));
```

**Table `logos`** :
```sql
-- Seuls les admins peuvent gérer les logos
CREATE POLICY "Admins can manage logos"
  ON public.logos FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
  ));
```

**Storage `logos`** :
```sql
-- Seuls les admins peuvent upload/delete
CREATE POLICY "Admins can upload logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'logos' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin')
  );
```

### Protection côté client

```typescript
// Vérification au chargement de la page
async function checkAdminAccess() {
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!userData || userData.role !== 'Admin') {
    router.push('/dashboard'); // Redirection
    return;
  }
}
```

---

## 📊 Architecture Base de Données

### Nouvelle colonne `role`

```sql
ALTER TABLE public.users 
ADD COLUMN role TEXT DEFAULT 'User' 
CHECK (role IN ('Admin', 'User'));
```

### Table `logos`

```sql
CREATE TABLE public.logos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  category TEXT DEFAULT 'official' CHECK (category IN ('official', 'event', 'social')),
  uploaded_by UUID REFERENCES public.users(id),
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Trigger notification réunions

```sql
CREATE OR REPLACE FUNCTION notify_new_meeting()
RETURNS TRIGGER AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM public.users LOOP
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      user_record.id,
      '📅 Nouvelle réunion programmée',
      NEW.title || ' - ' || TO_CHAR(NEW.meeting_date, 'DD/MM/YYYY à HH24:MI'),
      'info',
      '/meetings/' || NEW.id
    );
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 🎨 Design System

### Couleurs Admin

- **Primary (Orange)** : `#F97316` - Actions principales
- **Blue** : `#3B82F6` - Utilisateurs
- **Purple** : `#A855F7` - Logos
- **Green** : `#22C55E` - Absences
- **Red** : `#EF4444` - Tickets
- **Cyan** : `#06B6D4` - Réunions

### Effets Néon

```css
.shadow-neon-orange {
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.5),
              0 0 40px rgba(249, 115, 22, 0.3);
}
```

### Composants

- **Cards** : `bg-gradient-to-br from-white/10 to-white/5`
- **Borders** : `border border-white/10 hover:border-primary/50`
- **Buttons** : Gradient orange-red avec effet glow
- **Modals** : Backdrop blur + border néon

---

## 🔄 Flux de Données

### 1. Création d'une réunion

```
Admin crée réunion
    ↓
Enregistrement dans `meetings`
    ↓
Trigger SQL `notify_new_meeting()`
    ↓
Insertion dans `notifications` (TOUS les users)
    ↓
Affichage Front-End (toast/notification)
```

### 2. Upload d'un logo

```
Admin upload fichier
    ↓
Upload vers Storage (bucket `logos`)
    ↓
Récupération URL publique
    ↓
Insertion dans table `logos`
    ↓
Affichage automatique côté Front-End
```

### 3. Traitement d'une absence

```
User soumet demande
    ↓
Trigger SQL notifie admins
    ↓
Admin approuve/rejette
    ↓
Update `absences` (status, reviewed_by, reviewed_at)
    ↓
Notification envoyée au user
```

---

## 📱 Responsive Design

### Breakpoints

- **Mobile** : < 640px (2 colonnes navigation)
- **Tablet** : 640-1024px (3 colonnes navigation)
- **Desktop** : > 1024px (6 colonnes navigation)

### Optimisations Mobile

- Navigation en grid 2 colonnes
- Modals full-screen sur mobile
- Scroll vertical pour listes longues
- Touch-friendly (44x44px minimum)

---

## ✅ Checklist Installation

- [ ] Exécuter `admin-backoffice-schema.sql` dans Supabase SQL Editor
- [ ] Créer le bucket storage `logos` (public)
- [ ] Promouvoir au moins un utilisateur en Admin
- [ ] Vérifier les RLS policies (tables + storage)
- [ ] Tester l'accès à `/admin`
- [ ] Tester upload d'un logo
- [ ] Tester création d'une réunion + notification
- [ ] Tester CRUD utilisateurs
- [ ] Tester traitement absences/tickets

---

## 🚨 Troubleshooting

### Erreur : "Access denied"
→ Vérifier que l'utilisateur a `role = 'Admin'` dans la table `users`

### Erreur : "Cannot upload logo"
→ Vérifier que le bucket `logos` existe et est public

### Notifications ne s'affichent pas
→ Vérifier que le trigger `notify_new_meeting` est actif

### Impossible de supprimer un utilisateur
→ Vérifier les RLS policies et que l'utilisateur n'est pas admin

---

## 🎯 Prochaines Évolutions

- [ ] Dashboard avec graphiques (Chart.js)
- [ ] Export CSV des données
- [ ] Logs d'audit détaillés
- [ ] Gestion des permissions granulaires
- [ ] Notifications email (SendGrid/Resend)
- [ ] Backup automatique des données

---

**Développé avec 🧡 par SBCS**
