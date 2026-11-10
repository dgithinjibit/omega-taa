// Course data — vanilla JS module (no TypeScript)

export const courseModules = [
  {
    id: 'm1', number: '01', title: 'Cognitive Systems Primer',
    subtitle: 'From black-box LLMs to glass-box reasoning',
    duration: '2 weeks', level: 'Foundations', icon: 'brain',
    description: 'Understand why black-box AI fails in high-trust domains. Build the mental model for neuro-symbolic systems where neural perceives, symbolic reasons, and a human decides.',
    topics: [
      { name: 'The Black-Box Problem', detail: 'Why hallucinated confidence is dangerous in education, healthcare, and law.' },
      { name: 'Neuro-Symbolic Architecture', detail: 'Neural perception layers feeding symbolic reasoning cores.' },
      { name: 'The Glass-Box Contract', detail: 'No action without a traceable inference chain. Explainability as a requirement, not a feature.' },
      { name: 'Teacher-in-the-Loop', detail: 'Agents suggest, humans authorize. Augmentation over replacement.' },
    ],
    outcomes: ['Articulate the failure modes of opaque LLM tutors', 'Diagram a neuro-symbolic cognitive pipeline', 'Define the glass-box contract for an AI system'],
  },
  {
    id: 'm2', number: '02', title: 'AtomSpace & MeTTa',
    subtitle: 'Structured knowledge as first-class citizens',
    duration: '3 weeks', level: 'Core', icon: 'atom',
    description: "Work with Hyperon's AtomSpace — a hypergraph of typed atoms that represents knowledge, beliefs, and inference traces. Learn MeTTa, the meta-type talk language for defining and querying atoms.",
    topics: [
      { name: 'Atom Types', detail: 'Student atoms, knowledge atoms, event atoms, pedagogical atoms, inference atoms.' },
      { name: 'MeTTa Syntax', detail: 'Defining atoms, evaluating expressions, pattern matching over the hypergraph.' },
      { name: 'Lesson vs Global AtomSpace', detail: 'Ephemeral per-session spaces merged into persistent student models.' },
      { name: 'Confidence & Provenance', detail: 'Every atom carries :because, :rule, and :confidence. No orphan conclusions.' },
    ],
    outcomes: ['Write and query atoms in MeTTa', 'Design a typed atom schema for a domain', 'Merge ephemeral lesson atoms into a persistent student model'],
  },
  {
    id: 'm3', number: '03', title: 'Perception Layer Engineering',
    subtitle: 'Speech, vision, and language as atom sources',
    duration: '3 weeks', level: 'Core', icon: 'ear',
    description: 'Build the neural perception pipeline: Whisper for STT, diarization for speaker separation, VAD for utterance splitting, and the Atomizer that converts raw text into structured MeTTa atoms.',
    topics: [
      { name: 'Local Speech-to-Text', detail: 'Whisper.cpp on CPU, targeting sub-3-second latency on a laptop.' },
      { name: 'Diarization & VAD', detail: 'Assigning speakers and splitting utterances in noisy classroom audio.' },
      { name: 'The Atomizer', detail: 'Constrained LLM that outputs only schema-valid atoms — no free text, no hallucination.' },
      { name: 'Graceful Degradation', detail: 'When perception fails, the class continues. When reasoning fails, perception still logs.' },
    ],
    outcomes: ['Deploy a local Whisper pipeline with VAD', 'Build a schema-constrained atomizer', 'Implement fallback chains for perception failures'],
  },
  {
    id: 'm4', number: '04', title: 'Probabilistic Logic Networks',
    subtitle: 'Reasoning under uncertainty with PLN',
    duration: '3 weeks', level: 'Advanced', icon: 'sigma',
    description: 'Probabilistic Logic Networks combine fuzzy truth values with logical inference. Learn how PLN discovers correlations, propagates confidence, and produces inference chains you can audit.',
    topics: [
      { name: 'Truth Values', detail: 'Strength and confidence tuples. How evidence compounds and decays.' },
      { name: 'Inference Rules', detail: 'Deduction, induction, abduction, and revision over the AtomSpace.' },
      { name: 'Pattern Matching at Scale', detail: 'Running reasoning in 5-second batches. Caching patterns for real-time use.' },
      { name: 'Correlation Discovery', detail: 'Overnight PLN finds patterns humans missed — proposed to a reviewer, never auto-deployed.' },
    ],
    outcomes: ['Apply PLN inference rules to an AtomSpace', 'Tune confidence propagation for a domain', 'Design a human-review pipeline for discovered rules'],
  },
  {
    id: 'm5', number: '05', title: 'Pedagogical Reasoning',
    subtitle: 'Teaching rules, mastery models, and interventions',
    duration: '2 weeks', level: 'Advanced', icon: 'graduationCap',
    description: 'Bridge cognitive systems and education. Model learning styles, prerequisite graphs, misconception detection, and the three-tier action system: observe, suggest, nudge.',
    topics: [
      { name: 'Curriculum Graphs', detail: 'Prerequisite atoms, topic hierarchies, and mastery deltas anchored to teacher-approved curriculum.' },
      { name: 'Misconception Detection', detail: 'Pattern matching student beliefs against curriculum truth. Firing rules with evidence chains.' },
      { name: 'Action Autonomy Levels', detail: 'Level 1 observe (auto), Level 2 suggest (teacher approves), Level 3 nudge (teacher-initiated).' },
      { name: 'Negative Feedback Loops', detail: 'Teacher dismissals become training signal for rules. The system learns what not to suggest.' },
    ],
    outcomes: ['Design a pedagogical rule set for a subject', 'Implement the three-tier action autonomy model', 'Wire teacher dismissals into rule feedback loops'],
  },
  {
    id: 'm6', number: '06', title: 'Privacy, Safety & Audit',
    subtitle: 'Building AGI you can put in a classroom',
    duration: '2 weeks', level: 'Advanced', icon: 'shieldCheck',
    description: 'The compliance and safety layer that makes cognitive systems deployable with vulnerable populations. Data minimization, local-first design, immutable audit logs, and the glass-box export.',
    topics: [
      { name: 'Local-First Architecture', detail: 'Raw audio never leaves the machine. Atoms are the persistent record, transcripts are ephemeral.' },
      { name: 'Data Handling Matrix', detail: 'What is stored, where, for how long, and who sees it. Purpose limitation as architecture.' },
      { name: 'Immutable Audit Logs', detail: 'Every AI action: ActionID, RuleID, InputAtoms, OutputAtoms, Confidence, TeacherApproval.' },
      { name: 'The Parent Export', detail: '"Why did you tell my child X?" — producing the full inference chain on demand.' },
    ],
    outcomes: ['Architect a local-first deployment', 'Design an immutable audit log schema', 'Generate a glass-box export for any AI action'],
  },
  {
    id: 'm7', number: '07', title: 'Capstone: Build a Glass-Box Tutor',
    subtitle: 'Ship a complete auditable cognitive system',
    duration: '4 weeks', level: 'Capstone', icon: 'trophy',
    description: "Integrate everything. Build a live cognitive system that perceives student input, reasons about misconceptions transparently, and produces a glass-box audit trail a teacher can inspect.",
    topics: [
      { name: 'Full Pipeline Integration', detail: 'Perception → Atomizer → OMEGA Core → Reasoning → Action → Audit.' },
      { name: 'Live Dashboard', detail: 'Real-time mind-map, misconception alerts, and teacher controls over WebSocket.' },
      { name: 'Consolidation & Mastery', detail: 'Post-lesson merge, mastery deltas, personalized next steps, parent summary.' },
      { name: 'Defense & Audit Review', detail: "Present the system. Open the AtomSpace. Prove what changed in each student's mind." },
    ],
    outcomes: ['Deploy a complete glass-box cognitive system', 'Demonstrate a live lesson with full inference traces', 'Defend every AI action with an exportable audit chain'],
  },
];

export const principles = [
  { title: 'Glass-Box First', description: 'No pedagogical action without a traceable inference chain. If we cannot explain it, we do not act on it.', icon: 'eye' },
  { title: 'Teacher-in-the-Loop', description: 'The agent suggests, nudges, and surfaces. The teacher authorizes high-stakes interventions.', icon: 'users' },
  { title: 'Local-First Privacy', description: "Raw audio and video never leave the deployment. Atoms are the persistent record, not transcripts.", icon: 'lock' },
  { title: 'Portable Student Models', description: "A student's AtomSpace is their learning passport. It moves with them across classes and subjects.", icon: 'luggage' },
  { title: 'Curriculum-Grounded', description: 'The agent cannot invent curriculum. All reasoning is anchored to a teacher-approved curriculum graph.', icon: 'bookOpen' },
  { title: 'Offline-Degraded', description: 'Works on low bandwidth, intermittent power, and old hardware. Graceful degradation is a feature.', icon: 'wifiOff' },
];

export const architectureLayers = [
  { name: 'Transport', tech: 'Jitsi Meet', description: 'Video, audio, and chat. The room. Bot joins as a silent observer.', color: 'accent' },
  { name: 'Perception', tech: 'Whisper · VAD · Diarization', description: 'Neural layer. Speech-to-text, speaker separation, voice activity detection.', color: 'brand' },
  { name: 'Atomizer', tech: 'Constrained LLM', description: 'Converts utterances into schema-valid MeTTa atoms. No free text. No hallucination.', color: 'accent' },
  { name: 'OMEGA Core', tech: 'Hyperon · AtomSpace', description: 'The mind. Per-lesson and global AtomSpaces. PLN reasoning. Pedagogical rules.', color: 'brand' },
  { name: 'Action', tech: 'Bot · Dashboard · DeepTutor', description: 'Three-tier autonomy: observe, suggest, nudge. Teacher-controlled at every level.', color: 'accent' },
  { name: 'Persistence', tech: 'AtomSpace Store · Audit Log', description: 'Atoms persist. Transcripts expire. Audit logs are immutable and exportable.', color: 'brand' },
];

export const inferenceTrace = [
  { id: 1, layer: 'Perception', label: 'Student utterance captured', atom: '(Said stu_002 "I think 1/4 is bigger because 4 is bigger than 2" :ts 14:02:11)', confidence: 0.98, detail: 'Whisper transcribes audio locally. Diarization identifies speaker as stu_002. Latency: 2.1s.' },
  { id: 2, layer: 'Atomizer', label: 'Utterance converted to atoms', atom: '(Believes stu_002 (Greater 1/4 1/2) :confidence 0.85)\n(Reasoning stu_002 BiggerDenominator)', confidence: 0.85, detail: 'Constrained LLM maps the utterance to schema-valid atoms. Output validated against atom schema — no free text.' },
  { id: 3, layer: 'Reasoning', label: 'Misconception rule fires', atom: '(Inferred (Confused stu_002 Denominators)\n  :because [ (Believes stu_002 (Greater 1/4 1/2)) ]\n  :rule rule_denominator_confusion_v1\n  :confidence 0.78)', confidence: 0.78, detail: 'Pattern match: student belief contradicts curriculum truth (1/4 < 1/2). Rule fires with evidence chain attached.' },
  { id: 4, layer: 'Action', label: 'Suggestion pushed to teacher', atom: '(Suggest Teacher VisualModel\n  :target stu_002\n  :reason (Confused stu_002 Denominators)\n  :level 2)', confidence: 0.78, detail: 'Level 2 action: teacher must approve. Dashboard card: "Student 002 may confuse denominators. Suggest visual demo?"' },
  { id: 5, layer: 'Audit', label: 'Action logged immutably', atom: '(ActionLog :id act_0142\n  :rule rule_denominator_confusion_v1\n  :input [ (Believes stu_002 ...) ]\n  :output [ (Suggest Teacher VisualModel) ]\n  :confidence 0.78\n  :approval pending)', confidence: 1.0, detail: 'Every AI action is logged with rule ID, input atoms, output atoms, confidence, and teacher approval status. Immutable. Exportable.' },
];

export const stats = [
  { value: '7', label: 'Course Modules' },
  { value: '19', label: 'Weeks of Content' },
  { value: '100%', label: 'Traceable Actions' },
  { value: '3', label: 'Tier Autonomy Model' },
];

export const levelStyles = {
  Foundations: 'bg-accent-500/10 text-accent-300 border-accent-500/20',
  Core: 'bg-brand-500/10 text-brand-300 border-brand-500/20',
  Advanced: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  Capstone: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
};

export const layerColors = {
  Perception: { bg: 'bg-accent-500/10', text: 'text-accent-300', border: 'border-accent-500/30', dot: 'bg-accent-400' },
  Atomizer: { bg: 'bg-brand-500/10', text: 'text-brand-300', border: 'border-brand-500/30', dot: 'bg-brand-400' },
  Reasoning: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  Action: { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-400' },
  Audit: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30', dot: 'bg-purple-400' },
};

export const layerIcons = {
  Perception: 'eye',
  Atomizer: 'cpu',
  Reasoning: 'zap',
  Action: 'check',
  Audit: 'shieldCheck',
};
