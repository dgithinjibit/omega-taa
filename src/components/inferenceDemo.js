import { icon } from '../icons.js';
import { inferenceTrace, layerColors, layerIcons } from '../data.js';

export function renderInferenceDemo() {
  return `
    <section id="demo" class="relative py-24 border-t border-ink-800/40">
      <div class="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div class="max-w-2xl">
          <div class="text-xs font-mono uppercase tracking-widest text-brand-400/80 mb-3">Glass-Box Demo</div>
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-ink-100">Watch a student's mind get modeled</h2>
          <p class="mt-4 text-ink-400 leading-relaxed">
            This is the core of what you'll build. A student says something wrong.
            The system perceives it, atomizes it, reasons about it, suggests an
            intervention, and logs it — all with a traceable chain you can audit.
            <span id="backend-status" class="inline-flex items-center gap-1.5 ml-1 text-brand-400/70"></span>
          </p>
        </div>
        <div class="mt-12 grid lg:grid-cols-[1fr_360px] gap-6">
          <div class="bg-ink-900/40 border border-ink-800/60 rounded-2xl p-6 sm:p-8 min-h-[420px]">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse-slow"></div>
                <span class="text-sm font-mono text-ink-400">lesson_atomspace · live trace</span>
              </div>
              <div class="flex items-center gap-2">
                <button id="play-btn" class="inline-flex items-center gap-2 text-sm font-medium bg-brand-400 hover:bg-brand-300 text-ink-950 px-4 py-2 rounded-lg transition-colors">
                  ${icon('play', 16)}
                  <span id="play-label">Run trace</span>
                </button>
                <button id="reset-btn" class="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink-200 border border-ink-700 hover:border-ink-600 px-3 py-2 rounded-lg transition-colors">
                  ${icon('rotateCcw', 16)}
                </button>
              </div>
            </div>
            <div id="trace-container">
              <div id="trace-empty" class="flex flex-col items-center justify-center h-72 text-center">
                <div class="w-14 h-14 rounded-full bg-ink-800/50 border border-ink-700 flex items-center justify-center mb-4">
                  ${icon('play', 24, 'text-ink-500')}
                </div>
                <p class="text-sm text-ink-500 max-w-xs">
                  Press "Run trace" to watch the cognitive pipeline process a
                  student utterance in real time.
                </p>
              </div>
              <div id="trace-steps" class="hidden flex-col gap-1"></div>
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <div class="bg-ink-900/40 border border-ink-800/60 rounded-2xl p-6">
              <h3 class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-4">Pipeline Progress</h3>
              <div id="pipeline-progress" class="flex flex-col gap-3">
                ${inferenceTrace.map((step, i) => {
                  const lc = layerColors[step.layer];
                  return `
                    <div class="flex items-center gap-3" data-step="${i}">
                      <div class="step-indicator w-7 h-7 rounded-full flex items-center justify-center shrink-0 border bg-ink-800/40 border-ink-700 transition-all duration-300">
                        <div class="w-1.5 h-1.5 rounded-full bg-ink-600"></div>
                      </div>
                      <span class="step-label text-sm text-ink-600 transition-colors">${step.layer}</span>
                      <span class="step-conf ml-auto font-mono text-xs text-ink-500 hidden"></span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            <div id="approval-panel" class="bg-ink-900/40 border border-ink-800/60 rounded-2xl p-6 transition-all duration-300">
              <h3 class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-3">Teacher Approval Gate</h3>
              <div id="approval-content">
                <p class="text-xs text-ink-600 leading-relaxed">
                  A Level 2 suggestion will appear here once the trace completes.
                  No action reaches a student without teacher approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

let timers = [];
let playing = false;
let visibleCount = 0;
let teacherApproved = false;

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function confidenceBar(value) {
  return `
    <div class="flex items-center gap-2">
      <div class="w-20 h-1.5 bg-ink-800 rounded-full overflow-hidden">
        <div class="h-full bg-brand-400 rounded-full transition-all duration-500" style="width:${value * 100}%"></div>
      </div>
      <span class="font-mono text-xs text-ink-400">${value.toFixed(2)}</span>
    </div>
  `;
}

function traceCard(step, isLast) {
  const lc = layerColors[step.layer];
  const ic = layerIcons[step.layer];
  return `
    <div class="relative animate-trace">
      ${!isLast ? '<div class="absolute left-[18px] top-14 bottom-0 w-px bg-gradient-to-b from-ink-700 to-transparent"></div>' : ''}
      <div class="flex gap-4 pb-6">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${lc.bg} ${lc.border}">
          ${icon(ic, 18, lc.text)}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-mono uppercase tracking-wider ${lc.text}">${step.layer}</span>
            <span class="text-xs text-ink-600">·</span>
            <span class="text-xs text-ink-500">${step.label}</span>
          </div>
          <pre class="bg-ink-950/60 border border-ink-800/40 rounded-lg p-3.5 text-xs font-mono text-ink-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">${step.atom}</pre>
          <div class="flex items-center justify-between gap-4 mt-2.5">
            <p class="text-xs text-ink-500 leading-relaxed flex-1">${step.detail}</p>
            ${confidenceBar(step.confidence)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function updatePipeline() {
  inferenceTrace.forEach((step, i) => {
    const row = document.querySelector(`#pipeline-progress [data-step="${i}"]`);
    if (!row) return;
    const indicator = row.querySelector('.step-indicator');
    const label = row.querySelector('.step-label');
    const conf = row.querySelector('.step-conf');
    const lc = layerColors[step.layer];
    const ic = layerIcons[step.layer];
    const done = i < visibleCount;
    const active = i === visibleCount - 1 && playing;

    if (done) {
      indicator.className = `step-indicator w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${lc.bg} ${lc.border}`;
      indicator.innerHTML = icon(ic, 14, lc.text);
      label.className = 'step-label text-sm transition-colors text-ink-200';
      conf.classList.remove('hidden');
      conf.textContent = step.confidence.toFixed(2);
    } else {
      indicator.className = 'step-indicator w-7 h-7 rounded-full flex items-center justify-center shrink-0 border bg-ink-800/40 border-ink-700 transition-all duration-300';
      indicator.innerHTML = '<div class="w-1.5 h-1.5 rounded-full bg-ink-600"></div>';
      label.className = 'step-label text-sm transition-colors text-ink-600';
      conf.classList.add('hidden');
    }

    if (active) {
      indicator.classList.add('ring-2', 'ring-brand-400/40', 'ring-offset-2', 'ring-offset-ink-950');
    } else {
      indicator.classList.remove('ring-2', 'ring-brand-400/40', 'ring-offset-2', 'ring-offset-ink-950');
    }
  });
}

function updateApproval() {
  const panel = document.getElementById('approval-panel');
  const content = document.getElementById('approval-content');
  if (!panel || !content) return;
  const complete = visibleCount === inferenceTrace.length;

  if (complete) {
    panel.classList.remove('border-ink-800/60');
    panel.classList.add('border-rose-500/30');
  } else {
    panel.classList.add('border-ink-800/60');
    panel.classList.remove('border-rose-500/30');
  }

  if (!complete) {
    content.innerHTML = `<p class="text-xs text-ink-600 leading-relaxed">A Level 2 suggestion will appear here once the trace completes. No action reaches a student without teacher approval.</p>`;
    return;
  }

  if (teacherApproved) {
    content.innerHTML = `
      <div class="animate-fade-in">
        <div class="flex items-center gap-2 text-brand-300 mb-3">
          ${icon('check', 16)}
          <span class="text-sm font-medium">Approved — intervention sent</span>
        </div>
        <p class="text-xs text-ink-400 leading-relaxed">
          The visual demo nudge is delivered to the student. The action and its
          approval are written to the immutable audit log. A parent can later
          request the full chain.
        </p>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="animate-fade-in">
        <p class="text-sm text-ink-300 mb-1">Student 002 may confuse denominators.</p>
        <p class="text-xs text-ink-500 mb-4">Suggest a 2-minute visual demo?</p>
        <div class="flex gap-2">
          <button id="approve-btn" class="flex-1 text-sm font-medium bg-brand-400 hover:bg-brand-300 text-ink-950 py-2 rounded-lg transition-colors">Approve</button>
          <button id="dismiss-btn" class="flex-1 text-sm text-ink-400 hover:text-ink-200 border border-ink-700 hover:border-ink-600 py-2 rounded-lg transition-colors">Dismiss</button>
        </div>
        <p class="text-xs text-ink-600 mt-3 leading-relaxed">Dismissal is logged as negative feedback to the rule.</p>
      </div>
    `;
    document.getElementById('approve-btn')?.addEventListener('click', () => {
      teacherApproved = true;
      updateApproval();
    });
    document.getElementById('dismiss-btn')?.addEventListener('click', () => {
      teacherApproved = false;
      reset();
    });
  }
}

function renderSteps() {
  const container = document.getElementById('trace-steps');
  const empty = document.getElementById('trace-empty');
  if (!container || !empty) return;
  if (visibleCount === 0) {
    container.classList.add('hidden');
    container.classList.remove('flex');
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  container.classList.remove('hidden');
  container.classList.add('flex');
  const steps = inferenceTrace.slice(0, visibleCount);
  container.innerHTML = steps.map((s, i) => traceCard(s, i === steps.length - 1)).join('');
}

async function runTrace() {
  reset();
  playing = true;
  const playLabel = document.getElementById('play-label');
  const playBtn = document.getElementById('play-btn');
  if (playLabel) playLabel.textContent = 'Running...';
  if (playBtn) playBtn.disabled = true;

  let usedBackend = false;
  try {
    const res = await fetch('/api/trace/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.steps && data.steps.length > 0) {
        usedBackend = true;
        setBackendStatus(true);
        data.steps.forEach((_, i) => {
          const t = setTimeout(() => {
            visibleCount = i + 1;
            renderSteps();
            updatePipeline();
            if (i + 1 === data.steps.length) {
              playing = false;
              if (playLabel) playLabel.textContent = 'Replay';
              if (playBtn) playBtn.disabled = false;
              updateApproval();
            }
          }, 1400 * (i + 1));
          timers.push(t);
        });
      }
    }
  } catch {
    // Backend not available — use local data
  }

  if (!usedBackend) {
    setBackendStatus(false);
    inferenceTrace.forEach((_, i) => {
      const t = setTimeout(() => {
        visibleCount = i + 1;
        renderSteps();
        updatePipeline();
        if (i + 1 === inferenceTrace.length) {
          playing = false;
          if (playLabel) playLabel.textContent = 'Replay';
          if (playBtn) playBtn.disabled = false;
          updateApproval();
        }
      }, 1400 * (i + 1));
      timers.push(t);
    });
  }
}

function reset() {
  clearTimers();
  playing = false;
  visibleCount = 0;
  teacherApproved = false;
  const playLabel = document.getElementById('play-label');
  const playBtn = document.getElementById('play-btn');
  if (playLabel) playLabel.textContent = 'Run trace';
  if (playBtn) playBtn.disabled = false;
  renderSteps();
  updatePipeline();
  updateApproval();
}

function setBackendStatus(connected) {
  const el = document.getElementById('backend-status');
  if (!el) return;
  if (connected) {
    el.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-brand-400"></span>MeTTa backend live`;
  } else {
    el.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-ink-600"></span>demo mode (backend offline)`;
  }
}

export function initInferenceDemo() {
  const playBtn = document.getElementById('play-btn');
  const resetBtn = document.getElementById('reset-btn');
  if (playBtn) playBtn.addEventListener('click', runTrace);
  if (resetBtn) resetBtn.addEventListener('click', reset);

  fetch('/api/health').then(r => r.json()).then(() => setBackendStatus(true)).catch(() => setBackendStatus(false));

  reset();
}
