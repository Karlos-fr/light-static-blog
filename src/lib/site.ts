export function getAuthorName(): string {
  const authorName = import.meta.env.AUTHOR_NAME?.trim();

  if (!authorName) {
    throw new Error(
      "La variable d'environnement AUTHOR_NAME est obligatoire."
    );
  }

  return authorName;
}
