import globalStyles from '../../styles/global.css?raw';

export const prerender = true;

const xmlStyles = `
.site-header {
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.site-nav {
  width: min(100% - 2rem, var(--max-width));
  margin: 0 auto;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

.site-nav .brand {
  font-weight: 700;
  letter-spacing: 0.03em;
}

.site-nav .links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.xml-page-header {
  margin-bottom: 2rem;
}

.xml-page-header h1 {
  margin-bottom: 0.75rem;
}

.xml-intro {
  font-size: 1.05rem;
}

.xml-notice {
  padding: 0.85rem 1rem;
  background: var(--surface-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.xml-table-wrap {
  overflow-x: auto;
  margin-top: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.xml-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--surface);
}

.xml-table th,
.xml-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.xml-table th {
  background: var(--surface-soft);
  color: var(--text);
  font-size: 0.9rem;
}

.xml-table tr:last-child td {
  border-bottom: 0;
}

.xml-table td:last-child {
  color: var(--text-soft);
  white-space: nowrap;
}

.xml-table a {
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .site-nav {
    width: min(100% - 1.25rem, var(--max-width));
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }

  .site-nav .links {
    width: 100%;
    gap: 0.75rem 1rem;
  }

  .xml-table th,
  .xml-table td {
    padding: 0.7rem 0.8rem;
  }
}
`;

export function GET() {
  return new Response(`${globalStyles}\n${xmlStyles}`, {
    headers: {
      'content-type': 'text/css; charset=utf-8',
    },
  });
}
