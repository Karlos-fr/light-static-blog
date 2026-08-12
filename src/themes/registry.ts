/**
 * Registre des thèmes disponibles.
 *
 * Les thèmes sont découverts automatiquement à partir des fichiers
 * src/themes/<theme>/theme.css et chargés en texte brut pour l'endpoint CSS.
 */

/** Identifiant public d'un thème. */
export type ThemeId = string;

/** Modules CSS de thème importés par Astro au build. */
const themeModules = import.meta.glob('./*/theme.css', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Liste les thèmes réellement présents dans le dépôt local. */
function getAvailableThemes(): ThemeId[] {
  return Object.keys(themeModules)
    .map((path) => path.match(/^\.\/([^/]+)\/theme\.css$/)?.[1])
    .filter((themeId): themeId is string => Boolean(themeId));
}

/** Valide le thème demandé et applique le thème par défaut si besoin. */
export function resolveTheme(value: string | undefined): ThemeId {
  const themeId = value?.trim() || 'default';
  const availableThemes = getAvailableThemes();

  if (!availableThemes.includes(themeId as ThemeId)) {
    throw new Error(
      `Thème inconnu ou indisponible : "${themeId}". Thèmes disponibles : ${availableThemes.join(', ')}.`
    );
  }

  return themeId as ThemeId;
}

/** Retourne la feuille CSS brute du thème validé. */
export function getThemeCss(themeId: ThemeId): string {
  const theme = themeModules[`./${themeId}/theme.css`];
  if (!theme) {
    throw new Error(`La feuille CSS du thème "${themeId}" est introuvable.`);
  }

  return theme;
}
