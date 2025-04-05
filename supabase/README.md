# Configuration de la base de données Supabase

Ce dossier contient les fichiers nécessaires pour configurer la base de données Supabase pour le projet.

## Instructions d'installation

1. Créez un projet Supabase sur [https://supabase.com](https://supabase.com)
2. Une fois le projet créé, accédez à l'éditeur SQL dans le tableau de bord Supabase
3. Copiez le contenu du fichier `init.sql` et collez-le dans l'éditeur SQL
4. Exécutez le script SQL en cliquant sur le bouton "Run" ou en appuyant sur Ctrl+Enter

## Structure de la base de données

Le script SQL crée les éléments suivants :

- **Types énumérés** :
  - `role` : USER, ADMIN, MODERATOR
  - `website_status` : A attaquer, En cours, Attaqué
  - `website_priority` : Basse, Moyenne, Haute

- **Tables** :
  - `profiles` : Informations de profil des utilisateurs
  - `registration_codes` : Codes d'inscription
  - `websites` : Sites web à surveiller

- **Politiques RLS** :
  - Politiques de sécurité pour chaque table
  - Contrôle d'accès basé sur l'authentification

## Configuration de l'application

Après avoir exécuté le script SQL, vous devez mettre à jour les variables d'environnement de l'application :

1. Copiez le fichier `.env.example` vers `.env`
2. Mettez à jour les variables suivantes avec les valeurs de votre projet Supabase :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Remarques

- Le script SQL utilise des types énumérés pour garantir l'intégrité des données
- Les politiques RLS sont configurées pour sécuriser l'accès aux données
- Vous pouvez personnaliser les politiques RLS selon vos besoins spécifiques 