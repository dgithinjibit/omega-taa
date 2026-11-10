import { icon } from '../icons.js';

export function renderCTA() {
  return `
    <section id="enroll" class="relative py-24 border-t border-ink-800/40">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-brand-500/8 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="max-w-4xl mx-auto px-5 sm:px-8 relative text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-medium text-brand-300 mb-8">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow"></span>
          Cohort 01 · Starting Soon
        </div>
        <h2 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink-100 leading-tight">Build AI that earns trust.</h2>
        <p class="mt-6 text-lg text-ink-400 max-w-2xl mx-auto leading-relaxed">
          Join the first cohort of engineers trained in glass-box cognitive
          systems. 19 weeks. Seven modules. One auditable AI system you build
          from scratch and defend in a live review.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#curriculum" class="group inline-flex items-center gap-2 bg-brand-400 hover:bg-brand-300 text-ink-950 font-semibold px-7 py-3.5 rounded-xl transition-all hover:scale-[1.02]">
            Start the course
            ${icon('arrowRight', 16, 'group-hover:translate-x-0.5 transition-transform')}
          </a>
          <a href="#demo" class="inline-flex items-center gap-2 border border-ink-700 hover:border-ink-500 text-ink-200 font-medium px-7 py-3.5 rounded-xl transition-colors">Replay the demo</a>
        </div>
        <div class="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          ${[
            { label: 'Duration', value: '19 weeks' },
            { label: 'Format', value: 'Project-based' },
            { label: 'Level', value: 'Intermediate+' },
          ].map(item => `
            <div class="text-center">
              <div class="text-sm font-semibold text-ink-200">${item.value}</div>
              <div class="text-xs text-ink-500 mt-1">${item.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function renderFooter() {
  return `
    <footer class="border-t border-ink-800/40 py-12">
      <div class="max-w-7xl mx-auto px-5 sm:px-8">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
              ${icon('brain', 20, 'text-brand-400')}
            </div>
            <div>
              <div class="text-sm font-semibold text-ink-100">syncsenta</div>
              <div class="text-xs text-ink-500">Glass-box AI engineering</div>
            </div>
          </div>
          <nav class="flex flex-wrap gap-x-6 gap-y-2">
            ${[
              { label: 'Philosophy', href: '#principles' },
              { label: 'Curriculum', href: '#curriculum' },
              { label: 'Demo', href: '#demo' },
              { label: 'Architecture', href: '#architecture' },
              { label: 'Enroll', href: '#enroll' },
            ].map(l => `<a href="${l.href}" class="text-sm text-ink-400 hover:text-ink-100 transition-colors">${l.label}</a>`).join('')}
          </nav>
          <div class="flex items-center gap-3">
            ${['github', 'twitter', 'linkedin'].map(ic =>
              `<a href="#" class="w-9 h-9 rounded-lg border border-ink-800 hover:border-ink-600 flex items-center justify-center text-ink-400 hover:text-ink-100 transition-colors">${icon(ic, 16)}</a>`
            ).join('')}
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-ink-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-xs text-ink-600">© 2026 Syncsenta. Neural perceives. Symbolic reasons. Teacher decides.</p>
          <p class="text-xs text-ink-600 font-mono">v1.0 · glass-box protocol</p>
        </div>
      </div>
    </footer>
  `;
}
