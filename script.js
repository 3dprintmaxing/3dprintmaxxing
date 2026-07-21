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

(function initializePageMenu() {
  const languages = ['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];
  const languageLabels = {
    en: 'English',
    es: 'Español',
    'pt-br': 'Português',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    ja: '日本語',
    ko: '한국어',
    zh: '中文'
  };
  const menuLabels = {
    en: 'menu',
    es: 'menú',
    'pt-br': 'menu',
    fr: 'menu',
    de: 'menü',
    it: 'menu',
    ja: 'メニュー',
    ko: '메뉴',
    zh: '菜单'
  };
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const locale = languages.includes(pathParts[0]) ? pathParts[0] : 'en';
  const page = languages.includes(pathParts[0]) ? pathParts.slice(1).join('/') : pathParts.join('/');
  const currentPage = `/${locale}${page ? `/${page}` : '/'}`;

  const slugify = (text, used) => {
    const base = text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'section';
    let id = base;
    let number = 2;
    while (used.has(id)) id = `${base}-${number++}`;
    used.add(id);
    return id;
  };

  document.querySelectorAll('.header').forEach((header, index) => {
    const top = header.querySelector('.top');
    if (!top || top.dataset.pageMenuReady === 'true') return;
    top.dataset.pageMenuReady = 'true';

    top.querySelectorAll('.menu-toggle, .menu-panel').forEach((element) => element.remove());

    const logo = top.querySelector('.logo');
    if (logo) logo.href = `/${locale}/`;
    const nav = top.querySelector('.nav') || document.createElement('nav');
    nav.className = 'nav';
    const headings = Array.from(document.querySelectorAll('main h1, main h2, main h3'));
    const usedIds = new Set();
    const links = headings.map((heading) => {
      const id = heading.id || slugify(heading.textContent || '', usedIds);
      heading.id = id;
      usedIds.add(id);
      return `<a href="${currentPage}#${encodeURIComponent(id)}">${(heading.textContent || '').trim()}</a>`;
    });
    nav.innerHTML = links.join('');

    const lang = top.querySelector('.lang') || document.createElement('span');
    lang.className = 'lang';
    lang.innerHTML = languages.map((code) => {
      const destination = `/${code}${page ? `/${page}` : '/'}`;
      const current = code === locale ? ' aria-current="page"' : '';
      return `<a href="${destination}"${current}>${languageLabels[code]}</a>`;
    }).join(' ');

    const panel = document.createElement('div');
    panel.className = 'menu-panel';
    panel.id = `page-menu-${index}`;
    panel.append(nav, lang);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', panel.id);
    toggle.innerHTML = `<span class="menu-toggle-label">${menuLabels[locale]}</span><span class="menu-toggle-caret" aria-hidden="true"></span>`;

    if (logo) logo.insertAdjacentElement('afterend', toggle);
    else top.prepend(toggle);
    top.append(panel);

    const close = () => {
      header.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = !header.classList.contains('menu-open');
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    panel.addEventListener('click', (event) => {
      if (event.target.closest('a')) close();
    });
    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  });

  document.querySelectorAll('.footer a[href]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const match = href.match(/(?:^|\/)(privacy-policy|refund-policy|billing-policy)(?:\.html)?\/?$/);
    if (match) link.href = `/${locale}/${match[1]}`;
  });
})();
