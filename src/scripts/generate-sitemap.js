import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://flatsintegracao.com.br';
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Define static routes
const routes = [
    '/',
    '/lili',
    '/guia',
    '/guia/roteiro-vinho-petrolina',
    '/guia/onde-comer-petrolina-bododromo',
    '/guia/rio-sao-francisco-rodeadouro-barquinha',
    '/guia/hospedagem-corporativa-empresas-petrolina'
];

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

const generateSitemap = () => {
    console.log('🗺️  Generating sitemap.xml...');

    const urls = routes.map(route => {
        // Determine lastmod and priority based on route type
        let lastmod = getTodayDate(); // Default to today
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
