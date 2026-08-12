/**
 * Endpoint CSS pour l'affichage navigateur du flux RSS.
 *
 * Le flux reste un XML RSS valide pour les lecteurs, mais les navigateurs qui
 * appliquent les feuilles de style XML bénéficient d'un rendu compact.
 */
import { getPath } from '../../lib/urls';

/** Force Astro à générer cette feuille CSS au build statique. */
export const prerender = true;

/** Génère la feuille CSS RSS en réutilisant les variables du thème actif. */
export function GET() {
  const css = String.raw`@import url('${getPath('styles/theme.css')}');

/* Racine XML du flux : le navigateur affiche le RSS comme une page compacte. */
rss {
  display: block;
  min-height: 100vh;
  padding: clamp(1rem, 3vw, 2rem);
  color: var(--color-text);
  background: #000;
  font-family: var(--font-body);
  line-height: 1.45;
}

/* Conteneur RSS principal : reprend la largeur de contenu du thème actif. */
channel {
  display: block;
  width: min(100%, var(--content-width, 72rem));
  margin-inline: auto;
}

/* Par défaut, les métadonnées techniques du flux restent masquées au navigateur. */
channel > * {
  display: none;
}

/* Éléments utiles à la lecture humaine du flux RSS. */
channel > title,
channel > link,
channel > description,
channel > item {
  display: block;
}

/* Titre du flux : même logique visuelle que les titres de pages. */
channel > title {
  margin-block: 0;
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.02em;
}

/* Préfixe décoratif du titre, aligné avec les pages du site. */
channel > title::before {
  content: '# ';
  color: var(--color-accent);
}

/* Description courte du flux destinée à l'affichage navigateur. */
channel > description {
  max-width: 62rem;
  margin-block: 0.75rem 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.98rem;
}

/* Lien du site : visible et copiable, sans déborder sur mobile. */
channel > link {
  margin-block: 0 1.25rem;
  color: var(--color-accent);
  font-family: var(--font-mono);
  overflow-wrap: anywhere;
}

/* Libellé humain ajouté avant l'URL du site. */
channel > link::before {
  content: 'Site : ';
  color: var(--color-text-muted);
}

/* Carte d'item RSS : version simplifiée d'un résumé d'article. */
channel > item {
  margin-block: 0.55rem;
  padding: clamp(0.7rem, 2vw, 1rem);
  background: #020609;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: none;
}

/* Les champs RSS non utiles au rendu humain restent disponibles dans le XML mais invisibles. */
item > * {
  display: none;
}

/* Champs affichés pour chaque article dans le rendu navigateur du flux. */
item > title,
item > pubDate,
item > description,
item > link,
item > category {
  display: block;
}

/* Titre d'article dans la liste RSS. */
item > title {
  margin-block: 0 0.35rem;
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: clamp(1.05rem, 2.5vw, 1.35rem);
  font-weight: 700;
  line-height: 1.25;
}

/* Description courte d'article, volontairement distincte du contenu complet du lecteur RSS. */
item > description {
  margin-block: 0.25rem 0.5rem;
  color: var(--color-text-muted);
}

/* Date de publication : affichage compact pour ne pas alourdir le flux. */
item > pubDate {
  margin-block: 0.25rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

/* Libellé humain ajouté avant la date RSS. */
item > pubDate::before {
  content: 'Publié : ';
  color: var(--color-accent);
}

/* URL de l'article : visible et robuste aux longues adresses. */
item > link {
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  overflow-wrap: anywhere;
}

/* Libellé humain ajouté avant le lien d'article. */
item > link::before {
  content: 'Lien : ';
  color: var(--color-text-muted);
}

/* Catégories RSS : affichées comme petits tags simplifiés. */
item > category {
  display: inline-flex;
  width: max-content;
  min-height: 1.45rem;
  margin: 0.25rem 0.25rem 0.25rem 0;
  padding: 0.08rem 0.45rem;
  align-items: center;
  color: var(--color-accent);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  font-size: 0.76rem;
  font-weight: 700;
}

/* Mobile : réduit uniquement les marges horizontales du document XML affiché. */
@media (max-width: 760px) {
  rss {
    padding-inline: 1rem;
  }
}`;

  return new Response(css, {
    headers: {
      'content-type': 'text/css; charset=utf-8',
    },
  });
}
