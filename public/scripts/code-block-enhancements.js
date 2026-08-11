(function () {
  const languageLabels = {
    bash: 'Bash',
    css: 'CSS',
    html: 'HTML',
    js: 'JavaScript',
    javascript: 'JavaScript',
    json: 'JSON',
    md: 'Markdown',
    markdown: 'Markdown',
    sh: 'Shell',
    shell: 'Shell',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    xml: 'XML',
    yaml: 'YAML',
    yml: 'YAML',
  };

  function getLanguage(pre) {
    const rawLanguage =
      pre.dataset.language ||
      pre.querySelector('code')?.className.match(/language-([a-z0-9_-]+)/i)?.[1] ||
      '';
    const language = rawLanguage.trim().toLowerCase();

    return languageLabels[language] || rawLanguage.trim() || 'Code';
  }

  async function copyText(text) {
    if (!navigator.clipboard?.writeText) {
      throw new Error('Clipboard API unavailable');
    }

    await navigator.clipboard.writeText(text);
  }

  function enhanceCodeBlock(pre) {
    if (pre.closest('.code-block')) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';

    const header = document.createElement('div');
    header.className = 'code-block-header';

    const language = document.createElement('span');
    language.className = 'code-block-language';
    language.textContent = getLanguage(pre);

    const button = document.createElement('button');
    button.className = 'code-block-copy';
    button.type = 'button';
    button.textContent = 'Copier';
    button.setAttribute('aria-label', 'Copier le bloc de code');

    if (!navigator.clipboard?.writeText) {
      button.disabled = true;
      button.title = 'Copie indisponible dans ce navigateur';
    }

    button.addEventListener('click', async () => {
      try {
        await copyText(pre.textContent || '');
        button.textContent = 'Copié';
        window.setTimeout(() => {
          button.textContent = 'Copier';
        }, 1600);
      } catch {
        button.textContent = 'Erreur';
        window.setTimeout(() => {
          button.textContent = 'Copier';
        }, 1600);
      }
    });

    header.append(language, button);
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.append(header, pre);
  }

  function enhanceCodeBlocks() {
    document
      .querySelectorAll('.article-content pre')
      .forEach(enhanceCodeBlock);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceCodeBlocks);
  } else {
    enhanceCodeBlocks();
  }
})();
