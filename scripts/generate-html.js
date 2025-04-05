import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Liste des routes de votre application
const routes = [
  '',
  '/terminal',
  '/about',
  '/irisweb',
  '/monitoring',
  '/login',
  '/profile'
];

// Template HTML de base
const template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>FHS Data</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="stylesheet" href="/assets/index-BP7ds8aP.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/index-BYklwe1b.js"></script>
  </body>
</html>`;

// Créer le dossier dist s'il n'existe pas
const distPath = path.join(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Générer un fichier HTML pour chaque route
routes.forEach(route => {
  const routePath = route === '' ? 'index' : route.slice(1);
  const filePath = path.join(distPath, `${routePath}.html`);
  
  // Créer les dossiers nécessaires
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Écrire le fichier HTML
  fs.writeFileSync(filePath, template);
  console.log(`Généré: ${filePath}`);
}); 