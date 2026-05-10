# 🚀 Guide de Déploiement - CommissionHub

## Option 1 : Déploiement sur Vercel (Recommandé - Gratuit)

### Étape 1 : Créer un compte GitHub
1. Aller sur https://github.com
2. Créer un compte gratuit
3. Vérifier votre email

### Étape 2 : Installer Git
1. Télécharger Git : https://git-scm.com/download/win
2. Installer avec les options par défaut
3. Redémarrer votre ordinateur

### Étape 3 : Initialiser Git dans votre projet
Ouvrir le terminal dans le dossier du projet et exécuter :

```bash
git init
git add .
git commit -m "Initial commit - CommissionHub"
```

### Étape 4 : Créer un repository GitHub
1. Aller sur https://github.com/new
2. Nom du repository : `commissionhub`
3. Visibilité : **Private** (pour garder le code privé)
4. Cliquer sur "Create repository"

### Étape 5 : Pousser le code sur GitHub
Copier les commandes affichées sur GitHub et les exécuter :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/commissionhub.git
git branch -M main
git push -u origin main
```

### Étape 6 : Déployer sur Vercel
1. Aller sur https://vercel.com
2. Cliquer sur "Sign Up" et choisir "Continue with GitHub"
3. Autoriser Vercel à accéder à votre GitHub
4. Cliquer sur "Import Project"
5. Sélectionner votre repository `commissionhub`
6. Configurer les variables d'environnement :
   - Cliquer sur "Environment Variables"
   - Ajouter :
     - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé Supabase
7. Cliquer sur "Deploy"

### Étape 7 : Attendre le déploiement
- Le déploiement prend 2-5 minutes
- Vous recevrez une URL comme : `https://commissionhub-xxx.vercel.app`

### Étape 8 : Partager avec vos amis
Envoyez le lien à vos amis :
```
🌐 Site : https://commissionhub-xxx.vercel.app
📧 Email admin : bensenghorsaer@gmail.com
🔑 Mot de passe admin : [votre mot de passe]
```

---

## Option 2 : Déploiement sur Netlify (Alternative)

### Étape 1-5 : Identiques à Vercel

### Étape 6 : Déployer sur Netlify
1. Aller sur https://netlify.com
2. Cliquer sur "Sign Up" et choisir "GitHub"
3. Cliquer sur "New site from Git"
4. Sélectionner votre repository
5. Build settings :
   - Build command : `npm run build`
   - Publish directory : `.next`
6. Ajouter les variables d'environnement
7. Cliquer sur "Deploy site"

---

## Option 3 : Partage Local (Temporaire)

### Utiliser ngrok pour exposer votre serveur local

1. Télécharger ngrok : https://ngrok.com/download
2. Créer un compte gratuit sur ngrok
3. Installer ngrok
4. Lancer votre serveur Next.js :
```bash
npm run dev
```

5. Dans un autre terminal, lancer ngrok :
```bash
ngrok http 4028
```

6. Copier l'URL HTTPS fournie (ex: `https://abc123.ngrok.io`)
7. Partager cette URL avec vos amis

**⚠️ Attention :** 
- Votre ordinateur doit rester allumé
- L'URL change à chaque redémarrage de ngrok
- Gratuit mais limité à 2h de session

---

## 📊 Créer des Comptes de Test

### Pour tester le back-office, créez plusieurs comptes :

1. **Admin** (vous) :
   - Email : bensenghorsaer@gmail.com
   - Role : Admin
   - Grade : Delta

2. **Utilisateurs test** :
   - Demandez à vos amis de s'inscrire
   - Ou créez des comptes fictifs dans Supabase

### Données de test à créer :

1. **Présidents** :
   - Modifier 2-3 utilisateurs dans Supabase
   - Mettre `is_president = true`
   - Ajouter `president_year` et `president_achievements`

2. **Logos** :
   - Uploader 3-4 logos depuis le back-office

3. **Réunions** :
   - Créer 2-3 réunions à venir

4. **Demandes d'absence** :
   - Demander à vos amis de soumettre des demandes

5. **Idées** :
   - Demander à vos amis de soumettre des idées

6. **Tickets de support** :
   - Demander à vos amis de signaler des problèmes

---

## 🔒 Sécurité

### Variables d'environnement à NE JAMAIS partager :
- ❌ Ne partagez JAMAIS votre `SUPABASE_ANON_KEY` publiquement
- ❌ Ne commitez JAMAIS le fichier `.env.local`
- ✅ Utilisez toujours les variables d'environnement de Vercel/Netlify

### Accès Admin :
- Seul votre email `bensenghorsaer@gmail.com` a accès au back-office
- Les autres utilisateurs verront uniquement le dashboard

---

## 📱 Tester sur Mobile

Une fois déployé, vos amis peuvent tester sur :
- 📱 iPhone/Android
- 💻 Ordinateur
- 📱 Tablette

Le site est 100% responsive !

---

## 🐛 Résolution de Problèmes

### Erreur de build sur Vercel :
1. Vérifier que toutes les dépendances sont dans `package.json`
2. Vérifier que les variables d'environnement sont configurées
3. Regarder les logs de build sur Vercel

### Erreur de connexion Supabase :
1. Vérifier que les variables d'environnement sont correctes
2. Vérifier que RLS est désactivé sur les tables nécessaires
3. Vérifier les logs dans la console du navigateur

### Site lent :
1. Vérifier votre connexion internet
2. Vercel peut être lent la première fois (cold start)
3. Attendre 10-20 secondes et réessayer

---

## 📞 Support

Si vous avez des problèmes :
1. Vérifier les logs dans la console (F12)
2. Vérifier les logs de Vercel
3. Vérifier les logs de Supabase

---

## 🎉 Félicitations !

Votre site est maintenant en ligne et accessible par vos amis ! 🚀
