import { siteConfig } from '../config/site';
import { getPath } from './urls';

const projectUrl = 'https://github.com/Karlos-fr/light-static-blog';

type XmlShellOptions = {
  siteUrlHref: string;
  siteUrlExpression: string;
  siteName: string;
};

function escapeXmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function createXslResponse(stylesheet: string): Response {
  return new Response(stylesheet.trim(), {
    headers: {
      'content-type': 'text/xsl; charset=utf-8',
    },
  });
}

export function getXmlStylesheetHead(title: string): string {
  return `<head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        <script src="${getPath('scripts/color-mode-init.js')}"><xsl:text> </xsl:text></script>
        <link rel="stylesheet" href="${getPath('styles/theme.css')}" />
        <script src="${getPath('scripts/color-mode-toggle.js')}" defer="defer"><xsl:text> </xsl:text></script>
      </head>`;
}

export function getXmlStylesheetHeader({
  siteUrlHref,
  siteUrlExpression,
  siteName,
}: XmlShellOptions): string {
  return `<header class="site-header">
          <nav class="site-nav" aria-label="Navigation principale">
            <div class="site-identity">
              <a class="brand" href="${siteUrlHref}">${siteName}</a>
              <p class="site-tagline">${escapeXmlAttribute(siteConfig.tagline)}</p>
            </div>
            <div class="site-nav-actions">
              <ul class="site-links">
                <li><a href="${siteUrlHref}">Articles</a></li>
                <li><a href="{concat(${siteUrlExpression}, 'tags')}">Tags</a></li>
                <li><a href="{concat(${siteUrlExpression}, 'about')}">À propos</a></li>
              </ul>
              <span class="terminal-prompt" aria-hidden="true">&gt;_</span>
              <button class="color-mode-switch" type="button" role="switch" aria-checked="false" aria-label="Activer le mode sombre" title="Activer le mode sombre" data-color-mode-switch="">
                <svg class="color-mode-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" data-color-mode-icon="">
                  <circle class="color-mode-icon-sun" cx="12" cy="12" r="3.5" />
                  <path class="color-mode-icon-sun" d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
                  <path class="color-mode-icon-moon" d="M19.2 15.1A8 8 0 0 1 8.9 4.8a8 8 0 1 0 10.3 10.3Z" />
                </svg>
                <span class="visually-hidden" data-color-mode-label="">Mode sombre</span>
              </button>
            </div>
          </nav>
        </header>`;
}

export function getXmlStylesheetFooter(siteUrl: string): string {
  return `<footer class="site-footer">
          <nav aria-label="Liens complémentaires"><ul>
            <li><a class="rss-link" href="{concat(${siteUrl}, 'rss.xml')}"><span class="rss-icon" aria-hidden="true"></span>RSS</a></li>
            <li class="footer-separator" aria-hidden="true">/</li>
            <li><a class="powered-link" href="${projectUrl}" target="_blank" rel="noopener noreferrer"><img class="powered-icon" src="${getPath('images/light-static-blog-icon.png')}" alt="" aria-hidden="true" loading="lazy" />Propulsé par Light Static Blog</a></li>
          </ul></nav>
        </footer>`;
}

export function getXmlHtmlOpen(): string {
  return `<html lang="fr" data-theme="${escapeXmlAttribute(siteConfig.theme)}">`;
}
