import fs from 'fs';
import path from 'path';
import Critters from 'critters';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function optimize() {
    // Resolve dist paths relative to project root (assuming script is in src/scripts)
    const projectRoot = path.resolve(__dirname, '../../');
    const distDir = path.join(projectRoot, 'dist');
    const indexPath = path.join(distDir, 'index.html');

    console.log(`Optimizing critical CSS for: ${indexPath}`);

    if (!fs.existsSync(indexPath)) {
        console.error('❌ dist/index.html not found. Run build first.');
        process.exit(1);
    }

    const html = fs.readFileSync(indexPath, 'utf-8');

    const critters = new Critters({
        path: distDir,
        publicPath: distDir,
        compress: true,
        inlineFonts: false, // Keep fonts external/preloaded
        pruneSource: false, // Don't remove the original styles as we need them for dynamic content, just make them async
        preload: 'media', // Use media="print" onload="this.media='all'" pattern
        reduceInlineStyles: false,
        logLevel: 'info'
    });

    try {
        const optimizedHtml = await critters.process(html);
        fs.writeFileSync(indexPath, optimizedHtml);
        console.log('✅ Critical CSS inlined successfully!');
    } catch (e) {
        console.error('❌ Critters optimization failed:', e);
        process.exit(1);
    }
}

optimize();
