import { icon } from '../icons.js';
import { principles } from '../data.js';

export function renderPrinciples() {
  return `
    <section id="principles" class="relative py-24 border-t border-ink-800/40">
      <div class="max-w-7xl mx-auto px-5 sm:px-8">
        <div class="max-w-2xl">
          <div class="text-xs font-mono uppercase tracking-widest text-brand-400/80 mb-3">Design Philosophy</div>
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-ink-100">Six non-negotiable principles</h2>
          <p class="mt-4 text-ink-400 leading-relaxed">
            These are the product's design targets. The current prototype meets
            only some of them; see the implementation status and north-star spec
            for gaps before any real classroom use.
          </p>
        </div>
        <div class="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${principles.map((p, i) => `
            <div class="group relative bg-ink-900/40 border border-ink-800/60 rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300 hover:bg-ink-900/60">
              <div class="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                ${icon(p.icon, 20, 'text-brand-400')}
              </div>
              <h3 class="text-base font-semibold text-ink-100 mb-2">${p.title}</h3>
              <p class="text-sm text-ink-400 leading-relaxed">${p.description}</p>
              <div class="absolute top-5 right-5 text-xs font-mono text-ink-700 group-hover:text-brand-500/40 transition-colors">0${i + 1}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
