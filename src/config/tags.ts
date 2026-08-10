export const TAG_ACCENTS = ['primary', 'violet', 'blue', 'orange'] as const;

export type TagAccent = (typeof TAG_ACCENTS)[number];

export const tagAccents: Record<string, TagAccent> = {
  test: 'primary',
  rss: 'primary',
  retro: 'violet',
  gamedev: 'violet',
  jeu: 'violet',
  jeux: 'violet',
  bricolage: 'blue',
  outils: 'blue',
  shell: 'blue',
  sysadmin: 'blue',
  dev: 'orange',
  javascript: 'orange',
  methodologie: 'orange',
  productivite: 'orange',
};
