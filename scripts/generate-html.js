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

// Créer le dossier dist s'il n'existe pas
const distPath = path.join(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Lire le contenu du fichier index.html généré par Vite
const indexHtmlPath = path.join(distPath, 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

// Générer un fichier index.html pour chaque route
routes.forEach(route => {
  const routePath = route === '' ? '' : route.slice(1);
  const dirPath = path.join(distPath, routePath);
  
  // Créer les dossiers nécessaires
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Écrire le fichier index.html dans le sous-dossier
  const filePath = path.join(dirPath, 'index.html');
  fs.writeFileSync(filePath, indexHtmlContent);
  console.log(`Généré: ${filePath}`);
}); 