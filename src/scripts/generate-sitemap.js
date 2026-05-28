import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { ROUTES, SITE_URL } from '../constants/routes.js';

const BASE_URL = SITE_URL;
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Define static routes
const routes = ROUTES;

// Map routes to their main source files to get actual modification date
const routeToFileMap = {
    '/': 'src/pages/Home.tsx',
    '/lili': 'src/components/LandingLili/index.tsx',
    '/politica-privacidade': 'src/pages/PrivacyPolicy.tsx',
    '/guia': 'src/pages/GuideList.tsx',
    '/guia/roteiro-vinho-petrolina': 'src/pages/articles/WineRoute.tsx',
    '/guia/onde-comer-petrolina-bododromo': 'src/pages/articles/Bododromo.tsx',
    '/guia/rio-sao-francisco-rodeadouro-barquinha': 'src/pages/articles/RioSaoFrancisco.tsx',
    '/guia/hospedagem-corporativa-empresas-petrolina': 'src/pages/articles/Corporate.tsx',
    '/guia/hospedagem-proximo-hospitais-petrolina': 'src/pages/articles/MedicalStay.tsx',
    '/guia/flat-ou-hotel-petrolina-comparativo': 'src/pages/articles/FlatVsHotel.tsx',
    '/guia/onde-ficar-petrolina-sao-joao-guia': 'src/pages/articles/SaoJoao.tsx',
    '/guia/aluguel-mensal-petrolina-flat-mobiliado': 'src/pages/articles/MonthlyStay.tsx'
};

const getFileDate = (route) => {
    try {
        const filePath = path.resolve(__dirname, '../../', routeToFileMap[route]);
        const stats = fs.statSync(filePath);
        return stats.mtime.toISOString().split('T')[0];
    } catch (e) {
        console.warn(`Aviso: Arquivo fonte para ${route} não encontrado. Usando data atual.`);
        return new Date().toISOString().split('T')[0];
    }
};

const generateSitemap = () => {
    console.log('🗺️  Generating sitemap.xml...');

    const urls = routes.map(route => {
        // Determine lastmod based on actual file modification time
        let lastmod = getFileDate(route);
        let priority = '0.8';
        let changefreq = 'monthly';

        if (route === '/') {
            priority = '1.0';
            changefreq = 'weekly';
        } else if (route === '/guia') {
            priority = '0.9';
            changefreq = 'weekly';
        }

        return `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    try {
        fs.writeFileSync(SITEMAP_PATH, sitemapContent);
        console.log(`✅ Sitemap generated successfully at ${SITEMAP_PATH}`);
    } catch (error) {
        console.error('❌ Error writing sitemap:', error);
        process.exit(1);
    }
};

generateSitemap();
