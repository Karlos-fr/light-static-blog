<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sitemap"
>
  <xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Plan du site</title>
        <style>
          :root {
            color-scheme: light dark;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #f7f4ed;
            color: #24221f;
          }
          body { margin: 0; }
          main { width: min(100% - 2rem, 64rem); margin: 0 auto; padding: 3rem 0; }
          h1 { margin: 0 0 0.5rem; font-size: clamp(2rem, 6vw, 3.5rem); line-height: 1.05; }
          .intro { margin: 0 0 2rem; font-size: 1.05rem; line-height: 1.6; }
          .table-wrap { overflow-x: auto; border: 1px solid #c9c1b4; border-radius: 0.65rem; }
          table { width: 100%; border-collapse: collapse; background: #fffdf8; }
          th, td { padding: 0.85rem 1rem; border-bottom: 1px solid #ded8cd; text-align: left; }
          tr:last-child td { border-bottom: 0; }
          th { background: #eee8dc; font-size: 0.9rem; }
          td:last-child { white-space: nowrap; }
          a { color: #784216; overflow-wrap: anywhere; text-underline-offset: 0.18em; }
          a:hover, a:focus-visible { text-decoration-thickness: 0.15em; }
          @media (prefers-color-scheme: dark) {
            :root { background: #171614; color: #f1ece2; }
            .table-wrap { border-color: #4d4942; }
            table { background: #211f1c; }
            th { background: #2c2925; }
            th, td { border-bottom-color: #4d4942; }
            a { color: #ffbd7a; }
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Plan du site</h1>
          <p class="intro">
            <xsl:value-of select="count(sitemap:urlset/sitemap:url)" /> pages sont référencées dans ce sitemap.
          </p>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Dernière modification</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc" /></a></td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="sitemap:lastmod"><xsl:value-of select="sitemap:lastmod" /></xsl:when>
                        <xsl:otherwise>—</xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
