import { getPath } from '../../lib/urls';

export const prerender = true;

export function GET() {
  const css = String.raw`@import url('${getPath('styles/theme.css')}');

rss {
  display: block;
  min-height: 100vh;
  padding: clamp(1rem, 3vw, 2rem);
  color: var(--color-text);
  background: #000;
  font-family: var(--font-body);
  line-height: 1.45;
}

channel {
  display: block;
  width: min(100%, var(--content-width, 72rem));
  margin-inline: auto;
}

channel > * {
  display: none;
}

channel > title,
channel > link,
channel > description,
channel > item {
  display: block;
}

channel > title {
  margin-block: 0;
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.02em;
}

channel > title::before {
  content: '# ';
  color: var(--color-accent);
}

channel > description {
  max-width: 62rem;
  margin-block: 0.75rem 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.98rem;
}

channel > link {
  margin-block: 0 1.25rem;
  color: var(--color-accent);
  font-family: var(--font-mono);
  overflow-wrap: anywhere;
}

channel > link::before {
  content: 'Site : ';
  color: var(--color-text-muted);
}

channel > item {
  margin-block: 0.55rem;
  padding: clamp(0.7rem, 2vw, 1rem);
  background: #020609;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: none;
}

item > * {
  display: none;
}

item > title,
item > pubDate,
item > description,
item > link,
item > category {
  display: block;
}

item > title {
  margin-block: 0 0.35rem;
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: clamp(1.05rem, 2.5vw, 1.35rem);
  font-weight: 700;
  line-height: 1.25;
}

item > description {
  margin-block: 0.25rem 0.5rem;
  color: var(--color-text-muted);
}

item > pubDate {
  margin-block: 0.25rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

item > pubDate::before {
  content: 'Publié : ';
  color: var(--color-accent);
}

item > link {
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  overflow-wrap: anywhere;
}

item > link::before {
  content: 'Lien : ';
  color: var(--color-text-muted);
}

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
