import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const galleryDir = path.join(rootDir, 'public/assets/gallery');
const blogDir = path.join(rootDir, 'public/assets/blog');

async function optimizeFolder(directory, maxWidth = 800, quality = 75) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory not found: ${directory}`);
        return;
    }

    const files = fs.readdirSync(directory);

    for (const file of files) {
        if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;

        const filePath = path.join(directory, file);

        try {
            // Read to buffer FIRST to close file handle
            const inputBuffer = fs.readFileSync(filePath);

            const metadata = await sharp(inputBuffer).metadata();

            // Skip if already small? (Optional)

            console.log(`Optimizing ${file} (${metadata.width}x${metadata.height})...`);

            const outputBuffer = await sharp(inputBuffer)
                .resize({ width: maxWidth, withoutEnlargement: true })
                .webp({ quality: quality, effort: 6 })
                .toBuffer();

            // Now we can safely overwrite the file because the input stream is closed (it was a buffer)
            fs.writeFileSync(filePath, outputBuffer);

            console.log(`✅ Optimized ${file}`);

        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error);
        }
    }
}

async function run() {
    console.log('Starting aggressive image optimization (Buffer Mode)...');

    await optimizeFolder(galleryDir, 600, 70);
    await optimizeFolder(blogDir, 800, 70);

    console.log('Done!');
}

run();
