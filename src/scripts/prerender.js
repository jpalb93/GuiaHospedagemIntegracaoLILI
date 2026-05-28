import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbs = (p) => path.resolve(__dirname, '../../', p);

// Mock browser environment for SSR
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
    url: 'https://flatsintegracao.com.br'
});
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', {
    value: dom.window.navigator,
    writable: true,
    configurable: true
});
global.localStorage = {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
    clear: () => null
};
global.sessionStorage = global.localStorage;
Object.defineProperty(global, 'location', {
    value: dom.window.location,
    writable: true,
    configurable: true
});
global.history = dom.window.history;
global.HTMLElement = dom.window.HTMLElement;
global.customElements = dom.window.customElements;

// Crucial mocks for Framer Motion / GSAP and other browser-only APIs
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

Object.defineProperty(global, 'matchMedia', {
    writable: true,
    value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
    }),
});

global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
};

async function generate() {
    console.log('🚀 Starting Robust Prerender...');
    
    // 1. Get the routes
    const { ROUTES } = await import('../constants/routes.js');
    
    // 2. Load the template and the server entry
    const template = fs.readFileSync(toAbs('dist/index.html'), 'utf-8');
    const { render } = await import('../../dist/server/entry-server.js');

    for (const url of ROUTES) {
        console.log(`📦 Prerendering: ${url}`);
        
        // Update mock location for each route
        dom.reconfigure({ url: `https://flatsintegracao.com.br${url}` });
        
        const helmetContext = {};
        const appHtml = render(url, helmetContext);
        const { helmet } = helmetContext;

        // Inject HTML and Metadata
        let html = template
            .replace('<!--app-html-->', appHtml)
            .replace('<!--helmet-title-->', helmet?.title?.toString() || '')
            .replace('<!--helmet-meta-->', helmet?.meta?.toString() || '');

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

generate().catch(err => {
    console.error('❌ Prerender failed:', err);
    process.exit(1);
});
