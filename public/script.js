document.querySelectorAll('form[data-print-form]').forEach((form) => {
  form.addEventListener('submit', () => {
    const next = form.dataset.thanks;
    if (next) {
      let redirect = form.querySelector('input[name="_next"]');
      if (!redirect) {
        redirect = document.createElement('input');
        redirect.type = 'hidden';
        redirect.name = '_next';
        form.appendChild(redirect);
      }
      redirect.value = new URL(next, window.location.href).href;
    }

    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[data-status]');
    if (button) button.disabled = true;
    if (status) status.textContent = 'Sending…';
  });
});

// Build a consistent, localized header + footer on every page.
(function () {
  var KNOWN = ['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];
  var LANG_LABELS = {
    en: 'English', es: 'Español', 'pt-br': 'Português', fr: 'Français',
    de: 'Deutsch', it: 'Italiano', ja: '日本語', ko: '한국어', zh: '中文'
  };
  var NAV_IDS = ['how', 'printer', 'request', 'policy', 'faq'];
  var NAV_LABELS = {
    en: ['how it works', 'what I’m printing on', 'request a print', 'printing policy', 'faq'],
    es: ['cómo funciona', 'con qué imprimo', 'solicitar una impresión', 'política de impresión', 'preguntas frecuentes'],
    'pt-br': ['como funciona', 'com o que eu imprimo', 'solicitar uma impressão', 'política de impressão', 'perguntas frequentes'],
    fr: ['comment ça marche', 'mon imprimante', 'demander une impression', 'politique d’impression', 'questions fréquentes'],
    de: ['so funktioniert es', 'mein Drucker', 'Druck anfragen', 'Druckrichtlinien', 'häufige fragen'],
    it: ['come funziona', 'la mia stampante', 'richiedi una stampa', 'politica di stampa', 'domande frequenti'],
    ja: ['ご利用の流れ', '使用しているプリンター', 'プリントを依頼する', 'プリントポリシー', 'よくある質問'],
    ko: ['진행 방법', '사용 장비', '출력 요청', '출력 정책', '자주 묻는 질문'],
    zh: ['流程', '打印设备', '申请打印', '打印政策', '常见问题']
  };

  var parts = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '').split('/').filter(Boolean);
  var hasLocale = KNOWN.indexOf(parts[0]) !== -1;
  var locale = hasLocale ? parts[0] : 'en';
  var isHome = hasLocale ? parts.length === 1 : parts.length === 0;
  var anchorBase = isHome ? '' : '/' + locale + '/';

  var top = document.querySelector('.header .top');
  if (top) {
    var logo = top.querySelector('.logo');

    var nav = top.querySelector('.nav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'nav';
      if (logo && logo.nextSibling) top.insertBefore(nav, logo.nextSibling);
      else top.appendChild(nav);
    }
    var labels = NAV_LABELS[locale] || NAV_LABELS.en;
    nav.innerHTML = NAV_IDS.map(function (id, i) {
      return '<a href="' + anchorBase + '#' + id + '">' + labels[i] + '</a>';
    }).join('');

    var lang = top.querySelector('.lang');
    if (!lang) {
      lang = document.createElement('span');
      lang.className = 'lang';
      top.appendChild(lang);
    }
    lang.innerHTML = KNOWN.map(function (code) {
      var current = code === locale ? ' aria-current="page"' : '';
      return '<a href="/' + code + '/"' + current + '>' + LANG_LABELS[code] + '</a>';
    }).join(' ');
  }

  var FILES = ['privacy-policy', 'refund-policy', 'billing-policy'];
  document.querySelectorAll('.footer a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    FILES.forEach(function (name) {
      if (href === name + '.html' || href === './' + name + '.html' || href.indexOf('/' + name + '.html') !== -1) {
        a.setAttribute('href', '/' + locale + '/' + name);
      }
    });
  });
})();

// Collapse the header nav + language links into a single dropdown menu.
document.querySelectorAll('.header').forEach((header, index) => {
  const top = header.querySelector('.top');
  const nav = header.querySelector('.nav');
  const lang = header.querySelector('.lang');
  if (!top || (!nav && !lang)) return;

  const panelId = 'header-menu-' + index;
  const panel = document.createElement('div');
  panel.className = 'menu-panel';
  panel.id = panelId;
  if (nav) panel.appendChild(nav);
  if (lang) panel.appendChild(lang);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'menu-toggle';
  toggle.setAttribute('aria-haspopup', 'true');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', panelId);
  toggle.innerHTML =
    '<span class="menu-toggle-label">menu</span><span class="menu-toggle-caret" aria-hidden="true"></span>';

  top.appendChild(toggle);
  top.appendChild(panel);

  const close = () => {
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    header.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    header.classList.contains('menu-open') ? close() : open();
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
  panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
});
