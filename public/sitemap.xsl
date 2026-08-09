<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sitemap"
>
  <xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <xsl:variable name="siteUrl" select="sitemap:urlset/sitemap:url[1]/sitemap:loc" />
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Plan du site</title>
        <link rel="stylesheet" href="styles/xml.css" />
      </head>
      <body>
        <header class="site-header">
          <nav class="site-nav">
            <a class="brand" href="{$siteUrl}">Light Blog</a>
            <div class="links">
              <a href="{$siteUrl}">Articles</a>
              <a href="{concat($siteUrl, 'tags')}">Tags</a>
              <a href="{concat($siteUrl, 'about')}">À propos</a>
              <a href="{concat($siteUrl, 'rss.xml')}">RSS</a>
              <a href="{concat($siteUrl, 'sitemap.xml')}">Sitemap</a>
            </div>
          </nav>
        </header>
        <main>
          <header class="xml-page-header">
            <h1>Plan du site</h1>
            <p class="xml-intro">
              <xsl:value-of select="count(sitemap:urlset/sitemap:url)" /> pages sont référencées dans ce sitemap.
            </p>
          </header>
          <div class="xml-table-wrap">
            <table class="xml-table">
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
