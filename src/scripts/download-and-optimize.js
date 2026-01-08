
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const outputDir = path.join(rootDir, 'public/assets/gallery');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const imagesToDownload = [
    { url: 'https://i.postimg.cc/W4TFSxSR/305095874.jpg', name: 'gallery-1' },
    { url: 'https://i.postimg.cc/5tbYpDp1/305095888.jpg', name: 'gallery-2' },
    { url: 'https://i.postimg.cc/1zsnMbBJ/334290310.jpg', name: 'gallery-3' },
    { url: 'https://i.postimg.cc/9QGwdcP3/334290394.jpg', name: 'gallery-4' },
    { url: 'https://i.postimg.cc/tgpZD8kK/334291651.jpg', name: 'gallery-5' },
    { url: 'https://i.postimg.cc/YSMG8TRP/334291852.jpg', name: 'gallery-6' },
    { url: 'https://i.postimg.cc/wBgyFn2w/334715657.jpg', name: 'gallery-7' },
    // gallery-3 is repeated in the original code, but we only need to download it once.
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
            } else {
                reject(new Error(`Failed to download ${url}: Status ${res.statusCode}`));
            }
        }).on('error', reject);
    });
};

async function processImages() {
    console.log('Starting image download and optimization...');

    for (const img of imagesToDownload) {
        const outputPath = path.join(outputDir, `${img.name}.webp`);

        try {
            console.log(`Downloading ${img.url}...`);
            const buffer = await downloadImage(img.url);

            console.log(`Optimizing ${img.name}...`);
            await sharp(buffer)
                .resize({ width: 800, withoutEnlargement: true }) // Max width 800px for gallery usage
                .webp({ quality: 80 })
                .toFile(outputPath);

            console.log(`✅ Saved ${img.name}.webp`);
        } catch (error) {
            console.error(`❌ Error processing ${img.name}:`, error);
        }
    }
}

processImages();
