import { icon } from '../icons.js';
import { architectureLayers } from '../data.js';

export function renderArchitecture() {
  return `
    <section id="architecture" class="relative py-24 border-t border-ink-800/40">
      <div class="max-w-7xl mx-auto px-5 sm:px-8">
        <div class="max-w-2xl">
          <div class="text-xs font-mono uppercase tracking-widest text-brand-400/80 mb-3">System Architecture</div>
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-ink-100">The current MVP and its boundaries</h2>
          <p class="mt-4 text-ink-400 leading-relaxed">
            This is the path implemented in the connected demo—not the complete
            classroom vision. Proposed integrations and production controls are
            called out explicitly.
          </p>
        </div>
        <div class="mt-14 flex flex-col gap-3">
          ${architectureLayers.map((layer, i) => {
            const isBrand = layer.color === 'brand';
            return `
              <div>
                <div class="group relative grid sm:grid-cols-[180px_200px_1fr] gap-4 sm:gap-6 items-center bg-ink-900/40 border rounded-2xl p-5 sm:p-6 hover:bg-ink-900/60 transition-all duration-300 ${isBrand ? 'border-brand-500/20 hover:border-brand-500/40' : 'border-accent-500/20 hover:border-accent-500/40'}">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold ${isBrand ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'bg-accent-500/10 text-accent-400 border border-accent-500/20'}">${i + 1}</div>
                    <span class="text-base font-semibold text-ink-100">${layer.name}</span>
                  </div>
                  <div class="text-xs font-mono ${isBrand ? 'text-brand-300' : 'text-accent-300'}">${layer.tech}</div>
                  <p class="text-sm text-ink-400 leading-relaxed">${layer.description}</p>
                  <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all ${isBrand ? 'bg-brand-500/40 group-hover:bg-brand-400/60' : 'bg-accent-500/40 group-hover:bg-accent-400/60'}"></div>
                </div>
                ${i < architectureLayers.length - 1 ? `<div class="flex justify-center py-1">${icon('arrowDown', 16, 'text-ink-700 animate-flow')}</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
        <div class="mt-16">
          <h3 class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-5">Deployment status</h3>
          <div class="grid md:grid-cols-3 gap-4">
            ${[
              { mode: 'Current', title: 'Omega co-tutor prototype', desc: 'Vite frontend + bearer-token-protected FastAPI demo + Omega / PeTTa profile configured for Groq. Synthetic text only; runtime exchange is not verified, and Omega may persist conversation history.', tag: 'Prototype' },
              { mode: 'Next', title: 'Controlled teacher test', desc: 'Requires access control, durable audit, retention controls, evaluation, and privacy approval.', tag: 'Not ready' },
              { mode: 'Later', title: 'Marketplace service', desc: 'Requires current platform onboarding, compatible service protocol, provider review, and operations.', tag: 'Not ready' },
            ].map(d => `
              <div class="bg-ink-900/30 border border-ink-800/50 rounded-xl p-5">
                <div class="flex items-center justify-between mb-3">
                  <span class="font-mono text-xs text-brand-400">${d.mode}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-ink-800/60 text-ink-400 border border-ink-700/40">${d.tag}</span>
                </div>
                <div class="text-sm font-semibold text-ink-100 mb-1.5">${d.title}</div>
                <p class="text-xs text-ink-500 leading-relaxed">${d.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}
