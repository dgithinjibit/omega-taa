import { icon } from '../icons.js';
import { courseModules, levelStyles } from '../data.js';

export function renderCurriculum() {
  return `
    <section id="curriculum" class="relative py-24 border-t border-ink-800/40">
      <div class="max-w-7xl mx-auto px-5 sm:px-8">
        <div class="max-w-2xl">
          <div class="text-xs font-mono uppercase tracking-widest text-brand-400/80 mb-3">Course Curriculum</div>
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-ink-100">Seven modules. One cognitive system.</h2>
          <p class="mt-4 text-ink-400 leading-relaxed">
            From the black-box problem to a deployed, auditable glass-box tutor.
            Click any module to see the topics, learning outcomes, and duration.
          </p>
        </div>
        <div class="mt-12 grid lg:grid-cols-[340px_1fr] gap-6">
          <div id="module-list" class="flex flex-col gap-2">
            ${courseModules.map((m, i) => `
              <button data-module="${m.id}" class="module-btn group text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${i === 0 ? 'bg-ink-900/80 border-brand-500/40' : 'bg-ink-900/20 border-ink-800/40 hover:border-ink-700 hover:bg-ink-900/40'}">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${i === 0 ? 'bg-brand-500/15 border border-brand-500/30' : 'bg-ink-800/40 border border-ink-700/40 group-hover:border-ink-600'}">
                  ${icon(m.icon, 20, i === 0 ? 'text-brand-400' : 'text-ink-400')}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-xs ${i === 0 ? 'text-brand-400' : 'text-ink-600'}">${m.number}</span>
                    <span class="text-sm font-medium truncate ${i === 0 ? 'text-ink-100' : 'text-ink-300'}">${m.title}</span>
                  </div>
                  <div class="text-xs text-ink-500 mt-0.5 truncate">${m.duration}</div>
                </div>
                ${icon('chevronRight', 16, `shrink-0 transition-all ${i === 0 ? 'text-brand-400 translate-x-0' : 'text-ink-600 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`)}
              </button>
            `).join('')}
          </div>
          <div id="module-detail"></div>
        </div>
      </div>
    </section>
  `;
}

export function initCurriculum() {
  const detail = document.getElementById('module-detail');
  const buttons = document.querySelectorAll('.module-btn');
  if (!detail || buttons.length === 0) return;

  function selectModule(id) {
    const m = courseModules.find(x => x.id === id);
    if (!m) return;

    buttons.forEach(btn => {
      const isActive = btn.dataset.module === id;
      btn.classList.toggle('bg-ink-900/80', isActive);
      btn.classList.toggle('border-brand-500/40', isActive);
      btn.classList.toggle('bg-ink-900/20', !isActive);
      btn.classList.toggle('border-ink-800/40', !isActive);
    });

    detail.innerHTML = `
      <div class="bg-ink-900/40 border border-ink-800/60 rounded-2xl p-7 sm:p-9 animate-fade-in">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
              ${icon(m.icon, 24, 'text-brand-400')}
            </div>
            <div>
              <div class="flex items-center gap-3 mb-1.5">
                <span class="font-mono text-sm text-brand-400">${m.number}</span>
                <span class="text-xs font-medium px-2 py-0.5 rounded-full border ${levelStyles[m.level]}">${m.level}</span>
              </div>
              <h3 class="text-xl font-bold text-ink-100">${m.title}</h3>
              <p class="text-sm text-ink-400 mt-1">${m.subtitle}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 text-sm text-ink-400">
            ${icon('clock', 16)}
            ${m.duration}
          </div>
        </div>
        <p class="mt-6 text-ink-300 leading-relaxed">${m.description}</p>
        <div class="mt-8">
          <h4 class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-4">Topics Covered</h4>
          <div class="grid sm:grid-cols-2 gap-3">
            ${m.topics.map(t => `
              <div class="bg-ink-950/40 border border-ink-800/40 rounded-lg p-4 hover:border-ink-700 transition-colors">
                <div class="text-sm font-medium text-ink-200">${t.name}</div>
                <div class="text-xs text-ink-500 mt-1.5 leading-relaxed">${t.detail}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="mt-8">
          <h4 class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-4">You Will Be Able To</h4>
          <ul class="flex flex-col gap-2.5">
            ${m.outcomes.map(o => `
              <li class="flex items-start gap-3 text-sm text-ink-300">
                ${icon('checkCircle2', 16, 'text-brand-400 shrink-0 mt-0.5')}
                ${o}
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => selectModule(btn.dataset.module));
  });

  selectModule(courseModules[0].id);
}
