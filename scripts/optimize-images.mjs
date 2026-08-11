import { readdir } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const imagesRoot = path.join(process.cwd(), 'public', 'images');
const pngQuality = 82;

async function listPngFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return listPngFiles(fullPath);
      }

      return entry.isFile() && entry.name.toLowerCase().endsWith('.png')
        ? [fullPath]
        : [];
    })
  );

  return files.flat();
}

const pngFiles = await listPngFiles(imagesRoot);

await Promise.all(
  pngFiles.map(async (filePath) => {
    const outputPath = filePath.replace(/\.png$/i, '.webp');

    await sharp(filePath)
      .webp({ quality: pngQuality })
      .toFile(outputPath);
  })
);

console.log(`Optimized ${pngFiles.length} image(s) to WebP.`);
