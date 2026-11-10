import { icon } from '../icons.js';

const links = [
  { label: 'Philosophy', href: '#principles' },
  { label: 'Curriculum', href: '#curriculum' },
  { label: 'Glass-Box Demo', href: '#demo' },
  { label: 'Architecture', href: '#architecture' },
];

export function renderNavbar() {
  return `
    <header id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
      <nav class="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center group-hover:border-brand-400/60 transition-colors">
            ${icon('brain', 20, 'text-brand-400')}
          </div>
          <span class="text-lg font-semibold tracking-tight text-ink-100">syncsenta</span>
        </a>
        <div class="hidden md:flex items-center gap-8">
          ${links.map(l => `<a href="${l.href}" class="text-sm text-ink-400 hover:text-ink-100 transition-colors">${l.label}</a>`).join('')}
          <a href="#enroll" class="text-sm font-medium text-ink-950 bg-brand-400 hover:bg-brand-300 px-4 py-2 rounded-lg transition-colors">Enroll</a>
        </div>
        <button id="menu-toggle" class="md:hidden text-ink-300 p-1" aria-label="Toggle menu">
          ${icon('menu', 24)}
        </button>
      </nav>
      <div id="mobile-menu" class="hidden md:hidden bg-ink-950/95 backdrop-blur-xl border-b border-ink-800/60">
        <div class="px-5 py-4 flex flex-col gap-3">
          ${links.map(l => `<a href="${l.href}" class="mobile-link text-sm text-ink-300 hover:text-ink-100 py-2">${l.label}</a>`).join('')}
          <a href="#enroll" class="mobile-link text-sm font-medium text-ink-950 bg-brand-400 px-4 py-2 rounded-lg text-center mt-2">Enroll</a>
        </div>
      </div>
    </header>
  `;
}

export function initNavbar() {
  const header = document.getElementById('navbar');
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!header || !toggle || !menu) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 24) {
      header.classList.add('bg-ink-950/85', 'backdrop-blur-xl', 'border-b', 'border-ink-800/60');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('bg-ink-950/85', 'backdrop-blur-xl', 'border-b', 'border-ink-800/60');
      header.classList.add('bg-transparent');
    }
  });

  toggle.addEventListener('click', () => menu.classList.toggle('hidden'));
  document.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', () => menu.classList.add('hidden'));
  });
}
