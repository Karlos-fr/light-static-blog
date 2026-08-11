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
>
  <xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat" />

  <xsl:template match="/rss/channel">
    ${getXmlHtmlOpen()}
      ${getXmlStylesheetHead('Flux RSS')}
      <body>
        ${getXmlStylesheetHeader({
          siteUrlHref: '{link}',
          siteUrlExpression: 'link',
          siteName: '<xsl:value-of select="title" />',
        })}
        <main class="site-main">
          <header class="xml-page-header article-content">
            <h1>Flux RSS</h1>
            <p>Ceci est un flux RSS. Copiez son adresse dans votre lecteur de flux pour suivre les nouvelles publications.</p>
          </header>
          <div class="xml-table-wrap rss-feed-table-wrap">
            <table class="xml-table rss-feed-table">
              <thead>
                <tr>
                  <th scope="col">Titre</th>
                  <th scope="col">Date</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="item">
                  <tr>
                    <td><a href="{link}"><xsl:value-of select="title" /></a></td>
                    <td><time><xsl:value-of select="substring(pubDate, 1, 16)" /></time></td>
                    <td><xsl:value-of select="description" /></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </main>
        ${getXmlStylesheetFooter('link')}
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

  return createXslResponse(stylesheet);
}
