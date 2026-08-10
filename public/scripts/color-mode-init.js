(function () {
  var key = 'light-static-blog:color-mode';
  var saved;
  try {
    saved = localStorage.getItem(key);
  } catch (_) {}
  var mode = saved === 'light' || saved === 'dark'
    ? saved
    : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.colorMode = mode;
})();
