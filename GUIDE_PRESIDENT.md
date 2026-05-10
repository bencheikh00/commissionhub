# 🎯 GUIDE: Marquer un président

## ⚠️ Problème
Le président n'apparaît pas dans "Anciens présidents" car les RLS policies bloquent les mises à jour.

## ✅ Solution (2 minutes)

### Étape 1: Ouvrir Supabase
1. Allez sur https://supabase.com
2. Connectez-vous
3. Sélectionnez votre projet CommissionHub

### Étape 2: Ouvrir SQL Editor
1. Cliquez sur **"SQL Editor"** dans le menu de gauche
2. Cliquez sur **"New query"**

### Étape 3: Copier-coller ce code

```sql
-- Désactiver temporairement RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Marquer ablaye Gueye comme président
UPDATE public.users 
SET 
  is_president = TRUE,
  president_year = '2024-2025',
  president_achievements = 'Digitalisation de la commission, création de la plateforme CommissionHub',
  president_color = 'from-orange-500 to-red-500'
WHERE prenom ILIKE '%ablaye%' AND nom ILIKE '%Gueye%';

-- Réactiver RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Vérifier
SELECT prenom, nom, is_president, president_year FROM public.users WHERE is_president = TRUE;
```

### Étape 4: Exécuter
1. Cliquez sur **"Run"** (bouton en bas à droite)
2. Vous devriez voir: `ablaye Gueye | true | 2024-2025`

### Étape 5: Relancer l'application
```bash
npm run dev
```

## 🎉 Résultat
Le président apparaîtra maintenant dans **"Anciens présidents"** !

---

## 📝 Pour marquer un autre président

Changez cette ligne dans le code SQL:
```sql
WHERE prenom ILIKE '%PRENOM%' AND nom ILIKE '%NOM%';
```

Exemple pour "Fatou Gueye":
```sql
WHERE prenom ILIKE '%Fatou%' AND nom ILIKE '%Gueye%';
```
