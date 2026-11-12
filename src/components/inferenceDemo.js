import { icon } from '../icons.js';
import { layerColors, layerIcons } from '../data.js';

const DEMO_STUDENT_ID = 'demo_learner';
const PIPELINE = ['Omega / PeTTa', 'MeTTa co-tutor skills', 'Groq via Omega'];
const DEFAULT_STATEMENT =
  'What is the difference between a fixed rule and a learned prediction?';

export function renderInferenceDemo() {
  return `
    <section id="demo" class="relative py-24 border-t border-ink-800/40">
      <div class="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div class="max-w-3xl">
          <div class="text-xs font-mono uppercase tracking-widest text-brand-400/80 mb-3">Omega / PeTTa co-tutor · live runtime required</div>
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-ink-100">Talk to the AI-literacy co-tutor</h2>
          <p class="mt-4 text-ink-400 leading-relaxed">
            Submit a synthetic learner message to the Omega runtime. Omega's
            LLM and restricted MeTTa co-tutor skills produce the reply; there is
            no Python tutoring or inference fallback.
            <span id="backend-status" class="inline-flex items-center gap-1.5 ml-1 text-brand-400/70" role="status" aria-live="polite"></span>
          </p>
        </div>
        <div class="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-100/90">
          Demo only: use synthetic, non-identifying text. Submitting sends the text
          to the connected Omega runtime and its configured model provider (Groq
          in this setup). Use synthetic, non-identifying text only. Omega's own
          conversation-history behavior must be reviewed before any real learner data is used.
        </div>
        <div class="mt-6 max-w-xl">
          <label for="api-token" class="block text-xs font-mono uppercase tracking-widest text-ink-400 mb-2">
            Demo access token
          </label>
          <input id="api-token" type="password" autocomplete="off" spellcheck="false" class="w-full rounded-xl border border-ink-700 bg-ink-950/70 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" placeholder="Enter OMEGA_API_TOKEN">
          <p class="mt-2 text-xs text-ink-500">
            Kept only in this page's memory and sent as a bearer token. Do not use a production administrator credential here.
          </p>
        </div>
        <div class="mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
          <div class="bg-ink-900/40 border border-ink-800/60 rounded-2xl p-6 sm:p-8">
            <label for="evidence-input" class="block text-xs font-mono uppercase tracking-widest text-ink-400 mb-3">
              Synthetic learner question
            </label>
            <textarea id="evidence-input" maxlength="4000" rows="4" class="w-full resize-y rounded-xl border border-ink-700 bg-ink-950/70 p-4 text-sm leading-relaxed text-ink-100 placeholder:text-ink-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" aria-describedby="evidence-help">${DEFAULT_STATEMENT}</textarea>
            <p id="evidence-help" class="mt-2 text-xs text-ink-500">
              Up to 4,000 characters. Do not enter real names, personal information, or live learner records.
            </p>
            <div class="mt-5 flex flex-wrap items-center gap-3">
              <button id="play-btn" class="inline-flex items-center gap-2 text-sm font-medium bg-brand-400 hover:bg-brand-300 disabled:opacity-50 disabled:cursor-wait text-ink-950 px-4 py-2.5 rounded-lg transition-colors">
                ${icon('play', 16)}
                <span id="play-label">Ask Omega</span>
              </button>
              <button id="reset-btn" class="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink-200 border border-ink-700 hover:border-ink-600 px-3 py-2.5 rounded-lg transition-colors">
                ${icon('rotateCcw', 16)}
                Clear result
              </button>
              <span id="request-status" class="text-xs text-ink-500" role="status" aria-live="polite"></span>
            </div>
            <div id="trace-empty" class="flex flex-col items-center justify-center min-h-56 text-center">
              <div class="w-14 h-14 rounded-full bg-ink-800/50 border border-ink-700 flex items-center justify-center mb-4">
                ${icon('play', 24, 'text-ink-500')}
              </div>
              <p class="text-sm text-ink-500 max-w-md">
                Send a synthetic question or statement to the live Omega runtime
                and see its co-tutor response.
              </p>
            </div>
            <div id="trace-steps" class="hidden flex-col gap-1 mt-8"></div>
          </div>
          <div class="flex flex-col gap-4">
            <div class="bg-ink-900/40 border border-ink-800/60 rounded-2xl p-6">
              <h3 class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-4">Pipeline</h3>
              <div id="pipeline-progress" class="flex flex-col gap-3">
                ${PIPELINE.map((layer, index) => `
                  <div class="flex items-center gap-3" data-step="${index}">
                    <div class="step-indicator w-7 h-7 rounded-full flex items-center justify-center shrink-0 border bg-ink-800/40 border-ink-700 transition-all duration-300">
                      <div class="w-1.5 h-1.5 rounded-full bg-ink-600"></div>
                    </div>
                    <span class="step-label text-sm text-ink-600 transition-colors">${layer}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div id="approval-panel" class="bg-ink-900/40 border border-ink-800/60 rounded-2xl p-6 transition-all duration-300">
              <h3 class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-3">Omega response</h3>
              <div id="approval-content">
                <p class="text-xs text-ink-600 leading-relaxed">
                  Omega's answer appears here when the runtime is connected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

let isProcessing = false;
let sessionApiToken = '';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function confidenceBar(value) {
  const confidence = Math.max(0, Math.min(1, Number(value) || 0));
  return `
    <div class="flex items-center gap-2" aria-label="Confidence ${confidence.toFixed(2)}">
      <div class="w-20 h-1.5 bg-ink-800 rounded-full overflow-hidden">
        <div class="h-full bg-brand-400 rounded-full" style="width:${confidence * 100}%"></div>
      </div>
      <span class="font-mono text-xs text-ink-400">${confidence.toFixed(2)}</span>
    </div>
  `;
}

function traceCard(step, isLast) {
  const colors = layerColors[step.layer] || layerColors.Atomizer;
  const iconName = layerIcons[step.layer] || 'check';
  return `
    <article class="relative animate-trace">
      ${!isLast ? '<div class="absolute left-[18px] top-14 bottom-0 w-px bg-gradient-to-b from-ink-700 to-transparent"></div>' : ''}
      <div class="flex gap-4 pb-6">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${colors.bg} ${colors.border}">
          ${icon(iconName, 18, colors.text)}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-mono uppercase tracking-wider ${colors.text}">${escapeHtml(step.layer)}</span>
            <span class="text-xs text-ink-600">·</span>
            <span class="text-xs text-ink-500">${escapeHtml(step.label)}</span>
          </div>
          <pre class="bg-ink-950/60 border border-ink-800/40 rounded-lg p-3.5 text-xs font-mono text-ink-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">${escapeHtml(step.content)}</pre>
          <div class="flex items-center justify-between gap-4 mt-2.5">
            <p class="text-xs text-ink-500 leading-relaxed flex-1">${escapeHtml(step.detail)}</p>
            ${step.confidence === null ? '' : confidenceBar(step.confidence)}
          </div>
        </div>
      </div>
    </article>
  `;
}

function setBackendStatus(connected) {
  const element = document.getElementById('backend-status');
  if (!element) return;
  element.textContent = connected ? '· Omega runtime connected' : '· Omega runtime unavailable';
  element.className = connected
    ? 'inline-flex items-center gap-1.5 ml-1 text-brand-400/70'
    : 'inline-flex items-center gap-1.5 ml-1 text-rose-300';
}

function setRequestStatus(message, isError = false) {
  const element = document.getElementById('request-status');
  if (!element) return;
  element.textContent = message;
  element.className = isError ? 'text-xs text-rose-300' : 'text-xs text-ink-500';
}

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(sessionApiToken ? { Authorization: `Bearer ${sessionApiToken}` } : {}),
      ...options.headers,
    },
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`The API returned an unreadable response (${response.status}).`);
  }
  if (!response.ok) {
    const detail = typeof payload.detail === 'string' ? payload.detail : 'Request failed.';
    throw new Error(`${detail} (HTTP ${response.status})`);
  }
  return payload;
}

function setBusy(busy) {
  isProcessing = busy;
  const button = document.getElementById('play-btn');
  const label = document.getElementById('play-label');
  if (button) button.disabled = busy;
  if (label) label.textContent = busy ? 'Waiting for Omega…' : 'Ask Omega';
}

function renderPipeline(completedSteps) {
  PIPELINE.forEach((layer, index) => {
    const row = document.querySelector(`#pipeline-progress [data-step="${index}"]`);
    if (!row) return;
    const indicator = row.querySelector('.step-indicator');
    const label = row.querySelector('.step-label');
    const done = index < completedSteps;
    const colors = layerColors[layer] || layerColors.Atomizer;
    const iconName = layerIcons[layer] || 'check';

    if (done) {
      indicator.className = `step-indicator w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${colors.bg} ${colors.border}`;
      indicator.innerHTML = icon(iconName, 14, colors.text);
      label.className = 'step-label text-sm transition-colors text-ink-200';
    } else {
      indicator.className = 'step-indicator w-7 h-7 rounded-full flex items-center justify-center shrink-0 border bg-ink-800/40 border-ink-700 transition-all duration-300';
      indicator.innerHTML = '<div class="w-1.5 h-1.5 rounded-full bg-ink-600"></div>';
      label.className = 'step-label text-sm transition-colors text-ink-600';
    }
  });
}

function formatAtom(atom) {
  const argument = atom.object ?? atom.value ?? atom.subject ?? '—';
  const student = atom.student_id ? ` ${atom.student_id}` : '';
  return `(${atom.predicate}${student} ${argument} :id ${atom.id} :confidence ${Number(atom.confidence).toFixed(2)})`;
}

function renderAnalysis(result) {
  const steps = [{
    layer: 'Omega / PeTTa',
    label: 'Response from the connected Omega runtime',
    content: result.response,
    detail: 'The API transports the lesson event to Omega and returns Omega’s response. It does not atomize, apply Python rules, or fabricate an inference trace.',
    confidence: null,
  }];

  const container = document.getElementById('trace-steps');
  const empty = document.getElementById('trace-empty');
  if (container && empty) {
    empty.classList.add('hidden');
    container.classList.remove('hidden');
    container.classList.add('flex');
    container.innerHTML = steps.map((step, index) => traceCard(step, index === steps.length - 1)).join('');
  }
  renderPipeline(PIPELINE.length);
  const content = document.getElementById('approval-content');
  if (content) {
    content.innerHTML = `<p class="text-sm text-ink-200 whitespace-pre-wrap">${escapeHtml(result.response)}</p>`;
  }
}

async function runTrace() {
  if (isProcessing) return;
  const token = document.getElementById('api-token')?.value.trim();
  if (!token) {
    setRequestStatus('Enter the demo access token to connect.', true);
    return;
  }
  sessionApiToken = token;
  const statement = document.getElementById('evidence-input')?.value.trim();
  if (!statement) {
    setRequestStatus('Enter a synthetic statement first.', true);
    return;
  }

  resetResult();
  setBusy(true);
  setRequestStatus('Starting a synthetic lesson…');
  try {
    const lesson = await requestJson('/api/lesson', {
      method: 'POST',
      body: JSON.stringify({
        lesson_id: `demo_${Date.now()}`,
        student_ids: [DEMO_STUDENT_ID],
        course: 'CodeYetu AI Foundations',
        lesson: 'AI Foundations Day 01',
        learning_objectives: [
          'Distinguish a fixed rule, a learned prediction, and a proposed agent action.',
          'Explain why a prediction is not permission to act.',
        ],
      }),
    });
    setRequestStatus('Waiting for the connected Omega / PeTTa runtime…');
    const result = await requestJson('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        student_id: DEMO_STUDENT_ID,
        timestamp: new Date().toISOString(),
        text: statement,
        source: 'chat',
      }),
    });
    renderAnalysis(result);
    setBackendStatus(true);
    setRequestStatus('Omega co-tutor response received.');
  } catch (error) {
    setBackendStatus(false);
    setRequestStatus(error.message, true);
  } finally {
    setBusy(false);
  }
}

function resetResult() {
  const container = document.getElementById('trace-steps');
  const empty = document.getElementById('trace-empty');
  if (container) {
    container.innerHTML = '';
    container.classList.add('hidden');
    container.classList.remove('flex');
  }
  if (empty) empty.classList.remove('hidden');
  renderPipeline(0);
  const content = document.getElementById('approval-content');
  if (content) {
    content.innerHTML = '<p class="text-xs text-ink-600 leading-relaxed">Omega’s answer appears here when the runtime is connected.</p>';
  }
}

export function initInferenceDemo() {
  document.getElementById('play-btn')?.addEventListener('click', runTrace);
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    resetResult();
    setRequestStatus('');
  });

  setBackendStatus(false);
  setRequestStatus('Enter the demo access token, then ask Omega.');
}
