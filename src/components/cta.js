import { icon } from '../icons.js';

export function renderCTA() {
  return `
    <section id="mvp-status" class="relative py-24 border-t border-ink-800/40">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-brand-500/8 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="max-w-4xl mx-auto px-5 sm:px-8 relative text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-medium text-brand-300 mb-8">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow"></span>
          MVP · Not for real learner data
        </div>
        <h2 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink-100 leading-tight">Test the Omega co-tutor loop.</h2>
        <p class="mt-6 text-lg text-ink-400 max-w-2xl mx-auto leading-relaxed">
          The prototype forwards a synthetic AI-literacy question to the
          Omega/PeTTa runtime, which is configured to use Groq and the classroom
          MeTTa skills. The real Omega image and Groq tool-call path have not
          yet been verified end to end. Use synthetic text only.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#demo" class="group inline-flex items-center gap-2 bg-brand-400 hover:bg-brand-300 text-ink-950 font-semibold px-7 py-3.5 rounded-xl transition-all hover:scale-[1.02]">
            Ask a synthetic question
            ${icon('arrowRight', 16, 'group-hover:translate-x-0.5 transition-transform')}
          </a>
          <a href="#architecture" class="inline-flex items-center gap-2 border border-ink-700 hover:border-ink-500 text-ink-200 font-medium px-7 py-3.5 rounded-xl transition-colors">Review MVP boundaries</a>
        </div>
        <div class="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          ${[
            { label: 'Agent runtime', value: 'Omega / PeTTa' },
            { label: 'Model provider', value: 'Groq Cloud' },
            { label: 'Real learner data', value: 'Not approved' },
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
              <div class="text-sm font-semibold text-ink-100">OMEGA TAA</div>
              <div class="text-xs text-ink-500">AI-literacy co-tutor prototype</div>
            </div>
          </div>
          <nav class="flex flex-wrap gap-x-6 gap-y-2">
            ${[
              { label: 'Principles', href: '#principles' },
              { label: 'Live demo', href: '#demo' },
              { label: 'MVP boundaries', href: '#architecture' },
              { label: 'Status', href: '#mvp-status' },
            ].map(l => `<a href="${l.href}" class="text-sm text-ink-400 hover:text-ink-100 transition-colors">${l.label}</a>`).join('')}
          </nav>
        </div>
        <div class="mt-8 pt-8 border-t border-ink-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-xs text-ink-600">OMEGA TAA · Synthetic classroom co-tutor prototype.</p>
          <p class="text-xs text-ink-600 font-mono">Omega / PeTTa · MeTTa skills · Groq-compatible provider</p>
        </div>
      </div>
    </footer>
  `;
}
