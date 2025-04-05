-- Fichier d'initialisation de la base de données Supabase
-- À exécuter dans l'éditeur SQL de Supabase après avoir cloné le projet

-- Création des types énumérés
CREATE TYPE public.role AS ENUM ('USER', 'ADMIN', 'MODERATOR');
CREATE TYPE public.website_status AS ENUM ('A attaquer', 'En cours', 'Attaqué');
CREATE TYPE public.website_priority AS ENUM ('Basse', 'Moyenne', 'Haute');

-- Création des tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  username text NULL,
  avatar_url text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.registration_codes (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  code text NOT NULL,
  is_used boolean NULL DEFAULT false,
  used_by uuid NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  used_at timestamp with time zone NULL,
  CONSTRAINT registration_codes_pkey PRIMARY KEY (id),
  CONSTRAINT registration_codes_code_key UNIQUE (code),
  CONSTRAINT registration_codes_used_by_fkey FOREIGN KEY (used_by) REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.websites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  url text NOT NULL,
  status website_status NOT NULL,
  priority website_priority NOT NULL,
  notes text NULL,
  added_by uuid NULL,
  created_by uuid NULL,
  date_added timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  ecrie boolean NULL DEFAULT false,
  CONSTRAINT websites_pkey PRIMARY KEY (id),
  CONSTRAINT fk_websites_profiles FOREIGN KEY (added_by) REFERENCES profiles(id),
  CONSTRAINT websites_added_by_fkey FOREIGN KEY (added_by) REFERENCES auth.users(id),
  CONSTRAINT websites_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- Création des politiques RLS

-- Politique pour les profils
CREATE POLICY "Les utilisateurs authentifiés peuvent voir tous les profils" 
ON profiles 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent créer leur propre profil" 
ON profiles 
FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" 
ON profiles 
FOR UPDATE 
TO authenticated 
USING ((select auth.uid()) = id) 
WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer des profils" 
ON profiles 
FOR DELETE 
TO authenticated 
USING ((select auth.uid()) = id);

-- Politiques pour les sites
CREATE POLICY "Les utilisateurs authentifiés peuvent voir tous les sites" 
ON websites 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des sites" 
ON websites 
FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres sites" 
ON websites 
FOR UPDATE 
TO authenticated 
USING ((select auth.uid()) = created_by) 
WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres sites" 
ON websites 
FOR DELETE 
TO authenticated 
USING ((select auth.uid()) = created_by);

-- Politiques pour les codes d'enregistrement
CREATE POLICY "Tout le monde peut vérifier les codes" 
ON registration_codes 
FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent créer des codes d'enregistrement" 
ON registration_codes 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Politiques pour les utilisateurs
CREATE POLICY "Les utilisateurs authentifiés peuvent voir leurs propres informations" 
ON auth.users 
FOR SELECT 
TO authenticated 
USING ((select auth.uid()) = id);

CREATE POLICY "Les utilisateurs authentifiés peuvent mettre à jour leurs propres informations" 
ON auth.users 
FOR UPDATE 
TO authenticated 
USING ((select auth.uid()) = id) 
WITH CHECK ((select auth.uid()) = id);

-- Activation des politiques RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

-- Création d'un utilisateur admin par défaut (à adapter selon vos besoins)
-- INSERT INTO auth.users (id, email, role) VALUES (gen_random_uuid(), 'admin@example.com', 'ADMIN'); 