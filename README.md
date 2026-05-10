<<<<<<< HEAD
# Next.js

A modern Next.js 15 application built with TypeScript and Tailwind CSS.

## 🚀 Features

- **Next.js 15** - Latest version with improved performance and features
- **React 19** - Latest React version with enhanced capabilities
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

## 🛠️ Installation

1. Install dependencies:
  ```bash
  npm install
  # or
  yarn install
  ```

2. Start the development server:
  ```bash
  npm run dev
  # or
  yarn dev
  ```
3. Open [http://localhost:4028](http://localhost:4028) with your browser to see the result.
=======
# CommissionHub

Une plateforme collaborative moderne pour la Commission Communication avec **intégration Supabase complète**.

## 🚀 Fonctionnalités

- **Next.js 15** - Framework React avec performance optimale
- **React 19** - Dernière version avec fonctionnalités avancées
- **TypeScript** - Type safety et autocomplétion
- **Supabase** - Backend as a Service (PostgreSQL + Auth + Storage)
- **Tailwind CSS** - Design moderne et responsive
- **Bootstrap Icons** - Icônes professionnelles
- **Dark Mode** - Basculer entre mode clair et sombre
- **Responsive** - Optimisé pour mobile, tablette et desktop

## ✨ Fonctionnalités principales

### 🏠 Dashboard unifié
- Navigation dans une seule page (SPA)
- Menu latéral avec toutes les fonctionnalités
- Animation de bienvenue personnalisée
- Skeleton screens pour le chargement
- **Données réelles depuis Supabase**

### 👥 Gestion des membres
- Liste complète des **membres réels** de la base de données
- Profils avec avatars et grades
- Statut en temps réel (online/away/offline)
- Interface responsive
- **Aucune donnée fictive**

### 📅 Demande d'absence
- Formulaire intégré (pas de redirection)
- Sélection de dates
- **Enregistrement dans Supabase**
- Notifications automatiques aux administrateurs
- Historique des demandes

### 🏆 Anciens présidents
- Historique des **présidents réels** (`is_president = true`)
- Cartes colorées avec années
- Réalisations et contributions
- **Données dynamiques depuis la DB**

### 💡 Boîte à idées
- Envoyer des suggestions
- **Enregistrement dans Supabase**
- Lecture par les administrateurs
- Notifications automatiques
- Formulaire simple et rapide

### 🎨 Galerie des logos
- Téléchargement direct des logos
- PNG transparent, blanc, noir
- Plus besoin de demander dans le chat

### 🚩 Signaler un problème
- Formulaire de support technique
- **Enregistrement dans Supabase**
- Rapport envoyé à l'administrateur
- Système de tickets avec priorités
- Pour bugs ou aide

### 🌓 Mode sombre/clair
- Bouton de bascule dans la navbar
- Thème noir, blanc, orange
- Transition fluide

### 🔒 Sécurité
- **Row Level Security (RLS)** activé sur toutes les tables
- Policies robustes pour protéger les données
- Authentification sécurisée
- Triggers automatiques pour les notifications
- Audit trail avec activity logs

## 🛠️ Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd commissionhub
```

### 2. Installer les dépendances
```bash
npm install
# or
yarn install
```

### 3. Configurer Supabase

#### a. Créer un projet Supabase
1. Aller sur [https://supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter les credentials (URL + Anon Key)

#### b. Exécuter le schéma SQL
1. Dans Supabase Dashboard → **SQL Editor**
2. Copier le contenu de `supabase-schema-complete.sql`
3. Exécuter le script
4. Vérifier les messages de succès

#### c. Créer le bucket Storage
1. Dans Supabase Dashboard → **Storage**
2. Créer un bucket : `avatars`
3. Rendre le bucket **public**

#### d. Configurer les variables d'environnement
Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
```

### 4. Lancer le serveur de développement
```bash
npm run dev
# or
yarn dev
```

### 5. Ouvrir l'application
Ouvrir [http://localhost:4028](http://localhost:4028) dans votre navigateur.

---

## 📊 Base de Données

### Tables Créées

- **users** - Membres de la commission
- **absences** - Demandes d'absence
- **ideas** - Boîte à idées
- **support_tickets** - Tickets de support
- **notifications** - Notifications utilisateurs
- **activity_logs** - Audit trail

### Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **Policies** robustes pour protéger les données
- **Triggers** automatiques pour les notifications
- **Indexes** pour optimiser les performances

### Documentation Complète

Consulter `SUPABASE_INTEGRATION.md` pour la documentation détaillée.
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)

## 📁 Project Structure

```
nextjs/
├── public/             # Static assets
├── src/
│   ├── app/            # App router components
│   │   ├── layout.tsx  # Root layout component
│   │   └── page.tsx    # Main page component
│   ├── components/     # Reusable UI components
│   ├── styles/         # Global styles and Tailwind configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies and scripts
├── postcss.config.js   # PostCSS configuration
└── tailwind.config.js  # Tailwind CSS configuration

```

## 🧩 Page Editing

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## 🎨 Styling

This project uses Tailwind CSS for styling with the following features:
- Utility-first approach for rapid development
- Custom theme configuration
- Responsive design utilities
- PostCSS and Autoprefixer integration

## 📦 Available Scripts

- `npm run dev` - Start development server on port 4028
- `npm run build` - Build the application for production
- `npm run start` - Start the development server
- `npm run serve` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## 📱 Deployment

Build the application for production:

  ```bash
  npm run build
  ```

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by Next.js and React
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new