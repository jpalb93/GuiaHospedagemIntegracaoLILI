
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

// Configuration
const targets = [
    {
        input: 'src/assets/logo-eximus.png',
        output: 'src/assets/logo-eximus.png', // Overwrite or new
        width: 224, // 2x size for retina (displayed as 112px)
        format: 'png', // Keep transparency
        quality: 90
    },
    {
        input: 'src/assets/flats-integracao-logo.png',
        output: 'src/assets/flats-integracao-logo.png',
        width: 188, // 2x (displayed as 94px)
        format: 'png',
        quality: 90
    },
    {
        input: 'public/assets/blog/vapor-do-vinho-montagem.jpg',
        output: 'public/assets/blog/vapor-do-vinho-montagem.jpg',
        width: 1324, // 2x displayed size (662px)
        format: 'webp',
        quality: 80,
        replaceExt: true // Changes .jpg to .webp
    },
    {
        input: 'public/assets/blog/bododromo-petrolina.jpg',
        output: 'public/assets/blog/bododromo-petrolina.jpg',
        width: 1324,
        format: 'webp',
        quality: 80,
        replaceExt: true
    },
    {
        input: 'public/assets/blog/rio-sao-francisco-rodeadouro.jpg',
        output: 'public/assets/blog/rio-sao-francisco-rodeadouro.jpg',
        width: 1324,
        format: 'webp',
        quality: 80,
        replaceExt: true
    }
];

async function processImages() {
    console.log('Starting image optimization...');

    for (const target of targets) {
        const inputPath = path.join(rootDir, target.input);

        // Handle extension replacement for WebP conversion
        let outputPath = path.join(rootDir, target.output);
        if (target.replaceExt) {
            const dir = path.dirname(outputPath);
            const name = path.basename(outputPath, path.extname(outputPath));
            outputPath = path.join(dir, `${name}.${target.format}`);
        }

        if (!fs.existsSync(inputPath)) {
            console.warn(`⚠️ File not found: ${inputPath}`);
            continue;
        }

        try {
            console.log(`Processing: ${target.input} -> ${path.basename(outputPath)}`);

            let pipeline = sharp(inputPath);

            // Resize if width specified
            if (target.width) {
                pipeline = pipeline.resize({ width: target.width, withoutEnlargement: true });
            }

            // Format conversion
            if (target.format === 'webp') {
                pipeline = pipeline.webp({ quality: target.quality });
            } else if (target.format === 'png') {
                pipeline = pipeline.png({ quality: target.quality, compressionLevel: 9 });
            } else if (target.format === 'jpeg' || target.format === 'jpg') {
                pipeline = pipeline.jpeg({ quality: target.quality });
            }

            // Write to buffer first to check savings
            const originalStats = fs.statSync(inputPath);
            const buffer = await pipeline.toBuffer();

            // Write file
            fs.writeFileSync(outputPath, buffer);

            const saved = originalStats.size - buffer.length;
            const savedPercent = (saved / originalStats.size * 100).toFixed(1);

            console.log(`✅ Saved ${(saved / 1024).toFixed(2)} KB (${savedPercent}%)`);

        } catch (error) {
            console.error(`❌ Error processing ${target.input}:`, error);
        }
    }
}

processImages();
