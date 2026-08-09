<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
>
  <xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat" />

  <xsl:template match="/rss/channel">
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="title" /> — Flux RSS</title>
        <style>
          :root {
            color-scheme: light dark;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #f7f4ed;
            color: #24221f;
          }
          body { margin: 0; }
          main { width: min(100% - 2rem, 48rem); margin: 0 auto; padding: 3rem 0; }
          header { margin-bottom: 2.5rem; }
          h1 { margin: 0 0 0.5rem; font-size: clamp(2rem, 6vw, 3.5rem); line-height: 1.05; }
          .intro { max-width: 42rem; font-size: 1.05rem; line-height: 1.6; }
          .notice { padding: 0.85rem 1rem; border: 1px solid #c9c1b4; border-radius: 0.5rem; background: #fffdf8; }
          .articles { display: grid; gap: 1rem; padding: 0; list-style: none; }
          article { padding: 1.25rem; border: 1px solid #c9c1b4; border-radius: 0.65rem; background: #fffdf8; }
          h2 { margin: 0 0 0.5rem; font-size: 1.25rem; }
          p { margin: 0.5rem 0 0; }
          time { color: #615b52; font-size: 0.9rem; }
          a { color: #784216; text-underline-offset: 0.18em; }
          a:hover, a:focus-visible { text-decoration-thickness: 0.15em; }
          @media (prefers-color-scheme: dark) {
            :root { background: #171614; color: #f1ece2; }
            .notice, article { border-color: #4d4942; background: #211f1c; }
            time { color: #beb6aa; }
            a { color: #ffbd7a; }
          }
        </style>
      </head>
      <body>
        <main>
          <header>
            <p><a href="{link}">← Retour au site</a></p>
            <h1><xsl:value-of select="title" /></h1>
            <p class="intro"><xsl:value-of select="description" /></p>
            <p class="notice">Ceci est un flux RSS. Copiez son adresse dans votre lecteur de flux pour suivre les nouvelles publications.</p>
          </header>
          <ul class="articles">
            <xsl:for-each select="item">
              <li>
                <article>
                  <h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
                  <time><xsl:value-of select="pubDate" /></time>
                  <p><xsl:value-of select="description" /></p>
                </article>
              </li>
            </xsl:for-each>
          </ul>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
