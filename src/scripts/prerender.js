import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbs = (p) => path.resolve(__dirname, '../../', p);

// Keep SSR in a real server-like environment. If window/document exist here,
// react-helmet-async switches to client mode and does not expose head tags in
// helmetContext, which would make the prerendered pages lose route metadata.
global.localStorage = {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
    clear: () => null,
};
global.sessionStorage = global.localStorage;

async function generate() {
    console.log('🚀 Starting Robust Prerender...');

    // 1. Get the routes
    const { ROUTES } = await import('../constants/routes.js');

    // 2. Load the template and the server entry
    const template = fs.readFileSync(toAbs('dist/index.html'), 'utf-8');
    const { render } = await import('../../dist/server/entry-server.js');

    for (const url of ROUTES) {
        console.log(`📦 Prerendering: ${url}`);

        const helmetContext = {};
        const appHtml = render(url, helmetContext);
        const { helmet } = helmetContext;

        // Inject HTML and Metadata
        // The base document keeps fallback metadata for client-only navigation. Remove those
        // Helmet-owned tags before inserting the route-specific SSR values to avoid duplicates.
        const templateWithoutHelmetDefaults = template
            .replace(/<title data-rh="true">[\s\S]*?<\/title>/, '')
            .replace(/<meta\b(?=[^>]*data-rh="true")[^>]*\/>/g, '')
            .replace(/<link\b(?=[^>]*data-rh="true")[^>]*\/>/g, '');

        const helmetHead = [
            helmet?.title?.toString(),
            helmet?.meta?.toString(),
            helmet?.link?.toString(),
            helmet?.script?.toString(),
        ]
            .filter(Boolean)
            .join('\n');

        let html = templateWithoutHelmetDefaults
            .replace('<!--app-html-->', appHtml)
            .replace('<!--favicon-title-->', `${helmetHead}\n        <!--favicon-title-->`);

        // Determine output path
        const fileName = url === '/' ? 'index.html' : `${url.replace(/^\//, '')}/index.html`;
        const filePath = toAbs(`dist/${fileName}`);

        // Ensure directory exists
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        // Write the file
        fs.writeFileSync(filePath, html);
    }

    console.log('✅ Prerender complete!');
    process.exit(0);
}

generate().catch((err) => {
    console.error('❌ Prerender failed:', err);
    process.exit(1);
});
