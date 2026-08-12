/**
 * Déclaration des tags connus et de leur accent visuel.
 *
 * Chaque tag utilisé par un article doit être déclaré ici afin d'éviter les
 * couleurs implicites ou les oublis silencieux au build.
 */

/** Accents visuels disponibles dans les thèmes. */
export type TagAccent = 'primary' | 'violet' | 'blue' | 'orange';

/** Association explicite entre slug de tag normalisé et accent visuel. */
export const tagAccents: Record<string, TagAccent> = {
  demo: 'primary',
  latin: 'violet',
  markdown: 'blue',
  methodologie: 'orange',
  projet: 'blue',
};
