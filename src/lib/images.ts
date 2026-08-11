import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const publicDir = join(process.cwd(), 'public');

export type ImageDimensions = {
  width: number;
  height: number;
};

function getPublicImagePath(value: string): string | undefined {
  let path = value.split(/[?#]/, 1)[0];

  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) {
    return undefined;
  }

  const base = import.meta.env.BASE_URL;
  if (base !== '/' && path.startsWith(base)) {
    path = `/${path.slice(base.length)}`;
  }

  if (!path.startsWith('/')) {
    return undefined;
  }

  return join(publicDir, ...path.split('/').filter(Boolean));
}

function getPngDimensions(filePath: string): ImageDimensions | undefined {
  const buffer = readFileSync(filePath);

  if (
    buffer.length < 24 ||
    buffer.readUInt32BE(0) !== 0x89504e47 ||
    buffer.readUInt32BE(4) !== 0x0d0a1a0a
  ) {
    return undefined;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

export function getImageDimensions(src: string): ImageDimensions | undefined {
  const filePath = getPublicImagePath(src);
  if (!filePath || !existsSync(filePath)) {
    return undefined;
  }

  const extension = extname(filePath).toLowerCase();

  return extension === '.png' ? getPngDimensions(filePath) : undefined;
}

export function getWebpVariant(src: string): string | undefined {
  if (!src.toLowerCase().split(/[?#]/, 1)[0].endsWith('.png')) {
    return undefined;
  }

  const webpSrc = src.replace(/\.png(?=([?#]|$))/i, '.webp');
  const webpPath = getPublicImagePath(webpSrc);

  return webpPath && existsSync(webpPath) ? webpSrc : undefined;
}
