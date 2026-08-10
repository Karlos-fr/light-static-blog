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
  xmlns:media="http://search.yahoo.com/mrss/"
  exclude-result-prefixes="media"
>
  <xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat" />

  <xsl:template match="/rss/channel">
    ${getXmlHtmlOpen()}
      ${getXmlStylesheetHead('<xsl:value-of select="title" /> — Flux RSS')}
      <body>
        ${getXmlStylesheetHeader({
          siteUrlHref: '{link}',
          siteUrlExpression: 'link',
          siteName: '<xsl:value-of select="title" />',
        })}
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
        ${getXmlStylesheetFooter('link')}
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

  return createXslResponse(stylesheet);
}
