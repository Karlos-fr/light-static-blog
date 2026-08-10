export type ThemeId = string;

const themeModules = import.meta.glob('./*/theme.css', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function getAvailableThemes(): ThemeId[] {
  return Object.keys(themeModules)
    .map((path) => path.match(/^\.\/([^/]+)\/theme\.css$/)?.[1])
    .filter((themeId): themeId is string => Boolean(themeId));
}

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

export function getThemeCss(themeId: ThemeId): string {
  const theme = themeModules[`./${themeId}/theme.css`];
  if (!theme) {
    throw new Error(`La feuille CSS du thème "${themeId}" est introuvable.`);
  }

  return theme;
}
