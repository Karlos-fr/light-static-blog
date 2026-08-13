/**
 * Helpers liés à l'identité éditoriale du site.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Retourne le nom d'auteur obligatoire, injecté au build via l'environnement. */
export function getAuthorName(): string {
  const authorName = import.meta.env.AUTHOR_NAME?.trim();

  if (!authorName) {
    throw new Error(
      "La variable d'environnement AUTHOR_NAME est obligatoire."
    );
  }

  return authorName;
}

/** Retourne la version courante du package pour les métadonnées d'interface. */
export function getPackageVersion(): string {
  const packageJsonPath = join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
    version?: string;
  };

  if (!packageJson.version) {
    throw new Error('La version du package est absente de package.json.');
  }

  return packageJson.version;
}
