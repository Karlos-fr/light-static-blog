export type PaginatedItems<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export function getPageCount(totalItems: number, perPage: number): number {
  if (!Number.isInteger(totalItems) || totalItems < 0) {
    throw new Error('Le nombre total d’éléments doit être un entier positif ou nul.');
  }
  if (!Number.isInteger(perPage) || perPage < 1) {
    throw new Error('La taille de page doit être un entier supérieur à zéro.');
  }
  return Math.max(1, Math.ceil(totalItems / perPage));
}

export function paginateItems<T>(items: T[], currentPage: number, perPage: number): PaginatedItems<T> {
  const totalPages = getPageCount(items.length, perPage);
  if (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > totalPages) {
    throw new Error(`La page ${currentPage} n’existe pas (1 à ${totalPages}).`);
  }
  const start = (currentPage - 1) * perPage;
  return { items: items.slice(start, start + perPage), currentPage, totalPages, totalItems: items.length };
}
