/**
 * Helpers liés à l'identité éditoriale du site.
 */

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
