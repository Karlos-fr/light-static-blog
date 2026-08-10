<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:media="http://search.yahoo.com/mrss/"
  exclude-result-prefixes="media"
>
  <xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat" />

  <xsl:template match="/rss/channel">
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="title" /> — Flux RSS</title>
        <script src="scripts/color-mode-init.js"><xsl:text> </xsl:text></script>
        <link rel="stylesheet" href="styles/theme.css" />
        <script src="scripts/color-mode-toggle.js" defer="defer"><xsl:text> </xsl:text></script>
      </head>
      <body>
        <header class="site-header">
          <nav class="site-nav" aria-label="Navigation principale">
            <div class="site-identity">
              <a class="brand" href="{link}"><xsl:value-of select="title" /></a>
              <p class="site-tagline">// Développement. Rétro. Outils.</p>
            </div>
            <div class="site-nav-actions">
              <ul class="site-links">
                <li><a href="{link}">Articles</a></li>
                <li><a href="{concat(link, 'tags')}">Tags</a></li>
                <li><a href="{concat(link, 'about')}">À propos</a></li>
              </ul>
              <span class="terminal-prompt" aria-hidden="true">&gt;_</span>
              <button class="color-mode-switch" type="button" role="switch" aria-checked="false" aria-label="Activer le mode sombre" title="Activer le mode sombre" data-color-mode-switch="">
                <svg class="color-mode-icon" viewBox="0 0 24 24" aria-hidden="true" data-color-mode-icon="">
                  <circle class="color-mode-icon-sun" cx="12" cy="12" r="3.5" />
                  <path class="color-mode-icon-sun" d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
                  <path class="color-mode-icon-moon" d="M19.2 15.1A8 8 0 0 1 8.9 4.8a8 8 0 1 0 10.3 10.3Z" />
                </svg>
                <span class="visually-hidden" data-color-mode-label="">Mode sombre</span>
              </button>
            </div>
          </nav>
        </header>
        <main class="site-main">
          <header class="xml-page-header">
            <h1><xsl:value-of select="title" /></h1>
            <p class="xml-intro"><xsl:value-of select="description" /></p>
            <p class="xml-notice">Ceci est un flux RSS. Copiez son adresse dans votre lecteur de flux pour suivre les nouvelles publications.</p>
          </header>
          <ul class="post-list">
            <xsl:for-each select="item">
              <li class="post-card">
                <article>
                  <xsl:if test="media:content/@url">
                    <img
                      class="xml-feed-cover"
                      src="{media:content/@url}"
                      alt="{concat('Illustration de ', title)}"
                    />
                  </xsl:if>
                  <h2 class="post-title"><a href="{link}"><xsl:value-of select="title" /></a></h2>
                  <p class="post-meta"><time><xsl:value-of select="pubDate" /></time></p>
                  <p><xsl:value-of select="description" /></p>
                </article>
              </li>
            </xsl:for-each>
          </ul>
        </main>
        <footer class="site-footer">
          <nav aria-label="Liens complémentaires"><ul>
            <li><a href="{concat(link, 'rss.xml')}">RSS</a></li>
            <li class="footer-separator" aria-hidden="true">/</li>
            <li><a href="{concat(link, 'sitemap.xml')}">Plan du site</a></li>
          </ul></nav>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
