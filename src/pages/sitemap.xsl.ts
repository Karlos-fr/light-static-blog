import { siteConfig } from '../config/site';
import {
  createXslResponse,
  getXmlHtmlOpen,
  getXmlStylesheetFooter,
  getXmlStylesheetHead,
  getXmlStylesheetHeader,
} from '../lib/xmlStylesheet';

export const prerender = true;

export function GET() {
  const stylesheet = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sitemap"
>
  <xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <xsl:variable name="siteUrl" select="sitemap:urlset/sitemap:url[1]/sitemap:loc" />
    ${getXmlHtmlOpen()}
      ${getXmlStylesheetHead('Plan du site')}
      <body>
        ${getXmlStylesheetHeader({
          siteUrlHref: '{$siteUrl}',
          siteUrlExpression: '$siteUrl',
          siteName: siteConfig.name,
        })}
        <main class="site-main">
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
        ${getXmlStylesheetFooter('$siteUrl')}
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

  return createXslResponse(stylesheet);
}
