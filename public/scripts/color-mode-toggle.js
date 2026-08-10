(function () {
  var key = 'light-static-blog:color-mode';
  var root = document.documentElement;
  var switches = Array.prototype.slice.call(document.querySelectorAll('[data-color-mode-switch]'));

  function update(mode) {
    var dark = mode === 'dark';
    root.dataset.colorMode = mode;
    switches.forEach(function (button) {
      button.setAttribute('aria-checked', String(dark));
      button.setAttribute('aria-label', dark ? 'Activer le mode clair' : 'Activer le mode sombre');
      button.setAttribute('title', dark ? 'Activer le mode clair' : 'Activer le mode sombre');
      var label = button.querySelector('[data-color-mode-label]');
      if (label) label.textContent = dark ? 'Mode clair' : 'Mode sombre';
    });
  }

  switches.forEach(function (button) {
    button.addEventListener('click', function () {
      var mode = root.dataset.colorMode === 'dark' ? 'light' : 'dark';
      update(mode);
      try { localStorage.setItem(key, mode); } catch (_) {}
    });
  });

  window.addEventListener('storage', function (event) {
    if (event.key === key && (event.newValue === 'light' || event.newValue === 'dark')) {
      update(event.newValue);
    }
  });

  update(root.dataset.colorMode === 'dark' ? 'dark' : 'light');
})();
