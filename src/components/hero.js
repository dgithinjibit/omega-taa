import { icon } from '../icons.js';
import { stats } from '../data.js';

export function renderHero() {
  return `
    <section id="top" class="relative pt-32 pb-20 overflow-hidden">
      <div class="absolute inset-0 grid-bg mask-fade-b"></div>
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute top-40 right-10 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div class="flex flex-col items-center text-center">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-medium text-brand-300 mb-8 animate-fade-in">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow"></span>
            AI Engineering Course · Now Enrolling
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink-100 leading-[1.1] max-w-4xl animate-fade-up">
            Build AI systems that can <span class="text-brand-400">explain why</span>
          </h1>
          <p class="mt-6 text-lg text-ink-400 max-w-2xl leading-relaxed animate-fade-up" style="animation-delay:0.1s">
            A 19-week course in glass-box cognitive engineering. Learn to build
            neuro-symbolic systems where neural perceives, symbolic reasons, and
            every decision carries a traceable inference chain.
          </p>
          <div class="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-up" style="animation-delay:0.2s">
            <a href="#curriculum" class="group inline-flex items-center gap-2 bg-brand-400 hover:bg-brand-300 text-ink-950 font-semibold px-6 py-3 rounded-xl transition-all hover:scale-[1.02]">
              Explore the curriculum
              ${icon('arrowRight', 16, 'group-hover:translate-x-0.5 transition-transform')}
            </a>
            <a href="#demo" class="inline-flex items-center gap-2 border border-ink-700 hover:border-ink-500 text-ink-200 font-medium px-6 py-3 rounded-xl transition-colors">
              ${icon('terminal', 16)}
              See the glass-box demo
            </a>
          </div>
          <div class="mt-20 w-full grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink-800/50 rounded-2xl overflow-hidden border border-ink-800/60 animate-fade-up" style="animation-delay:0.3s">
            ${stats.map(s => `
              <div class="bg-ink-950/80 px-6 py-8 text-center">
                <div class="text-3xl font-bold text-brand-400">${s.value}</div>
                <div class="mt-1.5 text-sm text-ink-400">${s.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}
