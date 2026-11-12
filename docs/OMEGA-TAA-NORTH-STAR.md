# OMEGA TAA — Product North Star and Marketplace Service Specification

**Status:** Product direction for review; not a marketplace submission or a
production-readiness claim
**Version:** 0.3
**Last reviewed:** 2026-11-12

## 1. North star

> A learner can ask an AI-literacy question and receive a curriculum-grounded
> response from an Omega/PeTTa co-tutor whose available skills, data boundary,
> and failure behavior are explicit and reviewable by the teacher.

OMEGA TAA is intended to become a **curriculum-grounded classroom co-tutor
running on the Omega/PeTTa agent framework** that an education application or
embodied platform such as Codey can connect to through a bounded interface.
It is not a replacement teacher, a student-surveillance product, or a claim
to have achieved AGI.

The first usable behavior is an interactive AI-literacy tutor. It can explain
approved lesson concepts, offer hints, check canonical practice labels, and
answer a learner using the Omega LLM loop and the restricted MeTTa co-tutor
skills. Evidence-based learner modeling, proactive monitoring, robot
perception, and physical actions are later capabilities—not features to
pretend are already present.

## 2. What “marketplace fit” means here

The marketplace is a distribution and service-discovery channel, not the
product architecture. OMEGA must first be a useful, callable service with a
clear contract. Listing or selling it is a separate step.

The SingularityNET AI Marketplace describes discovery and use of AI services.
The SingularityNET developer portal describes a service through its API
specification and metadata, including a display name, service description,
encoding/type, endpoint, and pricing/group information. Its older listing
guide also mentions a published service, TLS, a marketplace UI integration,
and provider paperwork/curation. These portal pages are historical platform
documentation, not a confirmation of the current ASI Alliance onboarding,
technical, commercial, or review requirements. Verify the current process
with the marketplace before implementation or submission.

Therefore, this specification takes the durable product lessons—not stale
platform implementation details—as its starting point:

- Publish a clearly bounded AI service, not an unexplained promise.
- Define machine-readable inputs and outputs, with examples and errors.
- Make the service usable by an integrating client without requiring access
  to this repository's internals.
- Describe supported uses, limits, data handling, availability, and cost
  honestly.
- Treat provider review, privacy, security, endpoint operations, payment,
  ratings, and marketplace UI requirements as explicit launch gates.

## 3. Intended users and jobs

### Primary users

- **Learner:** ask lesson-scoped questions and receive explanations or hints
  from the co-tutor under teacher-configured boundaries.
- **Teacher:** configure objectives and roster, observe the co-tutor, and
  pause it when appropriate.
- **Education application or platform integrator:** submit a lesson-scoped
  event and receive the co-tutor's response through a documented contract.
- **School or deployment operator:** configure approved curriculum, access,
  data boundaries, retention, and availability.

Learners are the subjects of carefully bounded educational evidence, not the
marketplace's direct customers in the first release. The service must not
require a child to create an account or interact with a marketplace.

### User job

“Help the learner understand the approved lesson objective, use a bounded
MeTTa skill when it improves the explanation, and stay within the teacher's
lesson and safety boundaries.”

## 4. Product boundaries

OMEGA is responsible for:

1. Accepting a lesson-scoped event through a classroom adapter.
2. Running the Omega/PeTTa agent loop with the restricted classroom skill
   profile and configured LLM provider.
3. Using MeTTa co-tutor skills to provide bounded explanations, hints, checks,
   and curriculum grounding.
4. Returning Omega's response and reporting runtime failures explicitly.
5. Keeping the teacher able to pause the integration.

OMEGA is not responsible for:

- Hosting or moderating a class, managing a school roster, or being a student
  information system.
- Recording video, identifying faces, recognizing a child's voice, or
  continuously monitoring learners.
- Establishing a learner's ability, diagnosis, motivation, personality, or
  “learning style” from a model response.
- Inventing curriculum, grading high-stakes work, or making consequential
  decisions about a learner.
- Monitoring students proactively, operating robot hardware, or triggering
  consequential student-facing actions without a separate approved capability.
- Silently learning or deploying new pedagogical policy from one learner,
  teacher override, or model output.

## 5. Co-tutor service contract

The current integration is a bounded **conversational AI-literacy co-tutor**,
not a Python-hosted evidence-inference API. The classroom adapter starts a
lesson, validates the roster and pause state, and forwards an event to the
Omega agent loop.

### Request

- `lesson_id` scoped to the caller's lesson;
- a roster of opaque, caller-scoped learner references;
- lesson/course title and approved learning objectives;
- event text, source, timestamp, and roster-scoped learner reference.

The adapter treats the learner text as untrusted content, does not interpret it
as instructions, and does not create atoms or learner diagnoses.

### Response

The current response contains the event ID, lesson ID, Omega-generated reply,
runtime identifier, and response timestamp. It does not claim an evidence
trace, learner confidence, misconception inference, or teacher approval unless
the Omega runtime actually returns and the adapter validates that information.

Future marketplace APIs may expose structured MeTTa evidence and inference
traces, but those must be produced by the Omega/PeTTa runtime and tested. The
Python transport must never synthesize them.

### Actions and agency

The co-tutor may answer direct lesson questions and provide approved hints.
The current profile does not include proactive perception, sensor-triggered
intervention, physical robot control, or external delegation. The teacher may
pause forwarding. Any future proactive action or robot control requires a
separate capability, explicit policy, auditable authorization, and pilot
approval; it is not implied by an LLM response.

## 6. Omega runtime, skills, and model policy

The implementation target is an **Omega/PeTTa co-tutor with a narrow
classroom skill surface**, not a second hand-written Python agent presented as
Omega. `omega-taa` now contains an HTTP/WebSocket bridge, a request-correlated
Omega channel plugin, a restricted MeTTa co-tutor plugin, and a custom Omega
image profile. The former Python atomizer and deterministic Python rule
package have been removed from the active backend.

### Runtime responsibilities

1. The Omega/PeTTa loop receives a lesson-scoped event through the custom
   classroom channel.
2. Omega's LLM loop converses and selects from the dedicated co-tutor skills.
   The MeTTa plugin contains the approved AI-literacy explanations, hints,
   canonical practice checks, and bounded curriculum checks.
3. Python validates the caller's lesson/roster boundary, pause state, and
   channel protocol. It does not atomize the utterance, infer a misconception,
   choose the teaching response, or apply a pedagogical rule.
4. Omega returns a response through the same authenticated channel. The bridge
   correlates it to the request and reports disconnects, malformed messages,
   and timeouts explicitly.
5. Any additional NAL/PLN trace or structured learning-state inference must be
   implemented and surfaced by Omega/MeTTa, not re-created as Python rules.

### Classroom skill boundary

The dedicated `backend/metta/skills.metta` is loaded last in a minimal Omega
profile. Its model-callable surface includes fixed explanations, hints,
canonical answer checks, bounded curriculum checks, a follow-up question,
and one response tool. Only the response tool sends a learner-facing message;
the other skills return content to Omega's LLM loop. Event validation, pause
state, and roster checks remain outside the model-callable tool list.

The stock Omega [`src/skills.metta`](../../Omega/src/skills.metta) also
registers broad capabilities, including shell, file access, web search, and
arbitrary MeTTa evaluation. Merely adding classroom skills to that default
catalogue is **not** a safe classroom profile. The co-tutor must run with a
restricted skill/tool allowlist and must not expose shell, arbitrary file
access, web access, arbitrary MeTTa evaluation, or external delegation to
learner input. If the upstream loop cannot enforce that boundary by
configuration, use a small dedicated runtime/profile or make the required
upstream change before connecting students.

### Groq provider boundary

Omega's generic `OpenAIAPI` provider uses the OpenAI Python client library
against a configurable OpenAI-compatible endpoint. It can be pointed at
Groq's API endpoint and use a Groq API key; an OpenAI API key is not required
unless the OpenAI service itself is selected. The classroom image profile
sets the Groq-compatible base URL and model. The launcher maps `GROQ_API_KEY`
to Omega's generic `OPENAIAPI_API_KEY` environment slot because its standard
launcher exposes that provider slot. The request still goes to Groq. The key
is not stored in the profile, MeTTa, prompts, lesson data, or source control.

OpenAI-compatible does not mean every model supports every request feature.
The actual Omega/OpenAI-client/Groq tool-call path has not yet been exercised.
Test the selected Groq model for Omega's tool-call format, strict schema
behavior, token-limit parameters, and error handling before relying on it. No
provider configuration is permission to send real learner data; that still
requires the separate privacy and school approvals in §7.

Strict JSON Schema constrains output shape; it does not prove that the model
understood the evidence correctly. MeTTa/NAL/PLN calculations are inspectable
but do not make incorrect premises true. Semantic validity requires labeled
evaluation, teacher review, and conservative behavior when uncertain.

### What the local source material says

These are design constraints for the rewrite, not claims that the current
prototype already meets them:

> “The core agent loop is approximately 200 lines of MeTTa.”
>
> “The LLM turns ambiguous natural language into structured atoms ... The
> formal engine takes those atoms and applies rules.”

— Local Omega [introduction](../../Omega/docs/introduction.md). The runtime
loop is in [src/loop.metta](../../Omega/src/loop.metta); this is the Omega
runtime we mean, rather than the separate OpenClaw delegation plugin.

> “A skill is three things: an entry in the skill catalogue; a MeTTa
> definition of how the skill executes; [and] optional Python/Prolog glue.”

— Local Omega [custom-skill tutorial](../../Omega/docs/tutorial-03-writing-a-custom-skill.md).
The co-tutor therefore needs a real MeTTa skill module and a registered,
testable skill surface—not only a Python rule or a prompt describing future
skills.

> “Execute a shell command.”
> “Evaluate a MeTTa s-expression.”

— Current entries in local Omega [src/skills.metta](../../Omega/src/skills.metta).
The same default catalogue also includes file and web tools. This is why the
classroom integration must remove those skills and expose only a deliberate
co-tutor allowlist; simply adding tutoring tools to the default catalogue is
not an acceptable student-facing configuration.

> “The symbolic engine cannot detect these errors — they look well-formed to
> it.”

— Local Omega [failure modes](../../Omega/docs/reference-failure-modes.md).
Formal execution does not validate the truth of an LLM-extracted premise, so
the validator, evidence provenance, and abstention behavior remain required.

> “Omega's persistent agent loop is not a teacher-tools API, and its
> unrestricted shell/file/web skills must not be exposed to teacher requests.”

— Syncsenta 0.0.2 [roadmap](../../../Syncsenta/Sync-0.0.2/docs/ROADMAP.md).
OMEGA TAA must keep its classroom API boundary and adapt it to a restricted
Omega runtime; the stock general-purpose agent loop is not a drop-in API.

The lesson-specific vocabulary comes from CodeYetu Day 01:

> “Distinguish a fixed rule, a learned prediction, and a proposed agent
> action.”
>
> “A rule follows instructions written by a person. A learned model estimates
> a pattern from examples. ... a prediction is not permission to act.”

— [CodeYetu Day 01 lesson material](../../../Codeyetu/lesson-materials/day-001.md).
The earlier classroom proposal in [om.txt](../../../om.txt) supplies the
longer-term hybrid-system motivation. Its child-development, learner-model,
and cross-lesson persistence proposals are not treated as implemented or
validated requirements for this first co-tutor.

## 7. Data, privacy, and trust requirements

These are launch requirements, not optional marketplace copy.

- Use synthetic evidence for development, demos, and marketplace evaluation
  until the school, project owner, and qualified privacy reviewer approve a
  real-data path.
- Do not send learner names, account identifiers, contact information, raw
  audio/video, or roster data to an external model provider.
- Short text can still contain identifying or sensitive details. External
  model use therefore requires an approved data-processing arrangement,
  minimization/redaction controls, and an explicit deployment decision; the
  absence of a student ID in a request is not sufficient privacy protection.
- Make lesson scope, authorization, retention, deletion, and export behavior
  explicit. Do not retain source text by default.
- Require authenticated, authorized callers; isolate tenants and lessons;
  protect secrets; use TLS; apply rate limits and request-size limits; and
  record security-relevant operations without logging sensitive content.
- Explain the service's data flow, subprocessors/model providers, regions,
  retention, failure behavior, and operator responsibilities before a
  consumer submits data.
- Keep an immutable or tamper-evident audit history for policy decisions and
  teacher approvals, while supporting lawful deletion of learner data.
- Provide a visible pause/disable path and fail closed to observation when a
  required component is unavailable.

No marketplace launch is permission to process children's data. Applicable
school, parental/guardian, legal, contractual, and data-protection review must
be completed for the chosen deployment.

## 8. Marketplace packaging requirements

Before calling OMEGA marketplace-ready, maintain a provider checklist and
verify each item against current marketplace guidance:

### Product and listing

- Display name: **OMEGA TAA — Omega Classroom Co-Tutor**
- One-sentence value proposition and concise listing description.
- Supported tasks, excluded tasks, representative request/response examples,
  limitations, and a clear statement that the output is not a diagnosis.
- Versioned public API schema and a runnable consumer example.
- Service documentation, support contact, changelog, and incident/status
  information.
- Honest service-level, latency, availability, and data-processing claims.
- Pricing model, free-call policy if any, usage unit, and failure/refund
  behavior.
- Listing artwork and an integration UI only if required by the current
  marketplace process; do not imply marketplace approval before it is granted.

### Technical and operational

- Select and verify a currently accepted service protocol and metadata format.
  The existing FastAPI JSON API is a prototype, not proof of marketplace
  compatibility. Keep the product contract independent of transport so a
  marketplace adapter can be added without changing reasoning semantics.
- Deploy a stable, monitored TLS endpoint with authentication, authorization,
  abuse protection, bounded resource use, and documented error codes.
- Pin and report model, prompt, skill-pack, and curriculum versions.
- Verify metadata integrity and endpoint ownership using the marketplace's
  current provider workflow.
- Test install/invocation, malformed requests, provider outages, timeout,
  duplicate request, overload, and safe refusal paths.
- Complete current provider verification, curation, legal, and marketplace UI
  steps with the marketplace team.

## 9. Evaluation and release gates

### Gate A — trustworthy local co-tutor

- Stable typed transport contract with valid, invalid, ambiguous, and
  unsupported request tests.
- Build and start the real Omega/PeTTa classroom profile; verify the restricted
  tool list and one complete Groq-backed tool-call exchange.
- A versioned synthetic evaluation set covering varied phrasing, ambiguity,
  off-topic content, instruction-like text, and relevant language variation.
- Measure curriculum correctness, age-appropriateness, abstention, prompt
  injection resilience, end-to-end latency, and provider failures.
- Human-reviewed examples show that the response stays within the lesson and
  does not diagnose a learner or claim unsupported certainty.

### Gate B — controlled teacher evaluation

- Teacher interface displays the learner/tutor exchange and current runtime
  status; no fabricated evidence trace or inferred mastery score is shown.
- Authentication, authorization, lesson isolation, safe logs, retention and
  deletion are implemented and tested.
- Written school/privacy approval exists for the exact data and provider
  configuration. Begin with synthetic data or adult-only testing otherwise.
- A teacher can pause the service and continue the lesson when OMEGA is
  unavailable.

### Gate C — marketplace candidate

- Current marketplace protocol, metadata, provider review, curation, and
  commercial requirements have been verified with the marketplace.
- A consumer can discover, understand, invoke, and interpret the service from
  its listing and API documentation.
- Security review, operational readiness, privacy disclosures, pricing, and
  support responsibilities are complete.
- Marketplace listing language describes an explainable reasoning assistant,
  not AGI, proven learning gains, or a validated student cognitive model.

No gate should be inferred from a passing unit test, a successful Groq call, or
a prototype listing page.

## 10. Proposed measures

These are product evaluation measures, not marketplace guarantees:

- **Curriculum response quality:** teacher-adjudicated accuracy across a
  synthetic lesson evaluation set.
- **Unsupported claims:** measure hallucinated or off-curriculum statements
  and clearly report dataset and model limits.
- **Safe abstention:** ambiguous, unsupported, or invalid requests do not
  produce a learner diagnosis or consequential action.
- **Teacher control:** a teacher can pause event forwarding; proactive or
  physical actions remain unavailable until separately authorized.
- **Service quality:** publish measured latency, availability, schema error
  rate, and provider failure rate for the exact deployment.
- **Educational usefulness:** evaluated with educators against a baseline;
  do not claim learning gains from service usage or teacher approval alone.

## 11. Roadmap direction

1. **Now — Run the configured integration:** build and start the classroom
   Omega image, verify the MeTTa plugin loads, and test one complete response
   using synthetic input.
2. **Next — Verify Groq compatibility through Omega:** exercise tool calls,
   request limits, timeouts, malformed output, and provider failures. The
   standalone strict-schema Groq check is present, but its request was blocked
   by HTTP 403 in this environment. No OpenAI API key is part of this plan.
3. **Then — Protect classroom data:** disable or constrain Omega's persistent
   conversation history for classroom use, define retention and deletion, and
   replace the shared development token with identity-aware authorization
   before any real learner data is considered.
4. **Then — Teacher evaluation:** assess response quality, curriculum
   grounding, age appropriateness, code-switching, and failure cases with
   educators. Add explicit audit/version metadata without inventing Python
   inference traces.
5. **Later — Marketplace and integrations:** verify current marketplace
   requirements; add any required protocol/metadata adapter. Evaluate Jitsi,
   perception, DeepTutor, persistence, and cross-lesson learning separately.

The product contract and safety policy should remain stable while transports,
models, reasoning implementations, or marketplace requirements evolve.

## 12. Current reality

At this writing, `omega-taa` contains a FastAPI transport boundary, a
request-correlated Omega WebSocket channel, a restricted MeTTa co-tutor
plugin, and a custom Docker profile for Omega's OpenAI-compatible provider
pointed at Groq. The Python atomizer and Python reasoning package have been
removed. Python and MeTTa unit tests pass, but those tests use a fake WebSocket
peer and stubbed MeTTa plugin functions.

The image is aligned to the local Omega v0.1.21 launcher, and its Dockerfile
adds the provider key to Omega's environment allowlist so the entrypoint does
not discard it. Actual image build/startup remains unverified because this
environment has no Docker or importable Hyperon runtime. A direct synthetic
Groq strict-schema tool-call request received HTTP 403 (Cloudflare code 1010);
this does not establish whether the configured key or model is valid. Omega's
stock conversation history also persists to its configured memory directory;
this must be addressed before using learner data.

All HTTP API routes now require a separate `OMEGA_API_TOKEN`; the browser demo
holds it only in page memory. CORS and trusted-host allowlists are
configurable. This shared token is not user identity or role-based
authorization, and deployment still needs TLS, proxy-level rate/body limits,
and network restrictions.

Neither repository currently supplies a production classroom deployment:
there is no marketplace adapter, production authentication, durable lesson
storage, labeled quality evaluation, or school/privacy approval for real
learner data. Prototype tests and synthetic demos do not change that status.

This specification defines a direction and release gates. It does not say the
current code satisfies them.

## 13. Marketplace references and provenance

Reviewed 2026-11-12. Platform documentation can change; confirm current
requirements with the marketplace before relying on it.

- [SingularityNET AI Marketplace](https://marketplace.singularitynet.io/) —
  current public marketplace landing page, reviewed for its service
  discovery/use positioning.
- [SingularityNET Developer Portal: Service](https://github.com/singnet/dev-portal/blob/master/docs/products/DecentralizedAIPlatform/CoreConcepts/MarketplaceEcosystem/service/index.md) —
  service API and metadata concepts; portal content may not represent the
  current ASI Alliance process.
- [SingularityNET Developer Portal (legacy): Marketplace requirements](https://github.com/singnet/dev-portal-old/blob/master/docs/ai-developers/marketplace.md) —
  older guide describing publication, TLS, marketplace UI, and paperwork.
  Treat as historical guidance, not binding current acceptance criteria.
- [SingularityNET Developer Portal: Initialize Service Metadata](https://github.com/singnet/dev-portal/blob/master/docs/products/DecentralizedAIPlatform/TUI/Menus/Services/MetadataMenu/initialize-service-metadata/index.md) —
  metadata initialization fields and historical service-type options.
- [Groq tool-use documentation](https://console.groq.com/docs/tool-use/overview) —
  tool-call request/response flow and model support.
- [Groq Structured Outputs documentation](https://console.groq.com/docs/structured-outputs) —
  strict schema requirements and the listed GPT-OSS model support.

The product-specific rationale is also grounded in the local
[OMEGA classroom proposal](../../om.txt),
[CodeYetu Day 01 lesson](../../Codeyetu/lesson-plans/day-001.md),
[Syncsenta Omega architecture](../../Syncsenta/Sync-0.0.2/docs/architecture/omega.md),
and [Syncsenta roadmap](../../Syncsenta/Sync-0.0.2/docs/ROADMAP.md).
