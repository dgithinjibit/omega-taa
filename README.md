# OMEGA TAA — Omega Classroom Co-Tutor

OMEGA TAA is a CodeYetu AI-literacy co-tutor built around the actual
Omega/PeTTa agent runtime. **Omega owns the agent loop, LLM interaction, and
MeTTa co-tutor skills. Python is only the classroom HTTP/WebSocket boundary:
there are no Python tutoring rules, Python inference engine, or offline
reasoning fallback.**

This is an integration prototype for synthetic lessons, not a production or
school-approved system. The live Omega image and Groq tool-call path have not
yet been run end-to-end in this environment.

## What runs where

```text
Teacher demo / classroom caller
  → FastAPI: lesson roster, event validation, pause state, HTTP response
  → authenticated, request-correlated WebSocket
  → Omega agent loop (PeTTa / MeTTa)
  → Omega OpenAI-compatible provider → Groq Cloud
  → restricted MeTTa AI-literacy co-tutor skills
  → Omega response returned through the API
```

The Python API never interprets learner text, extracts atoms, fires a
pedagogical rule, or decides what answer to give. If Omega is not connected,
tutoring requests fail with HTTP 503. They do not switch to a Python or demo
agent.

The classroom profile exposes fixed AI-literacy explanations and hints,
canonical practice checks, bounded curriculum checks, a follow-up question,
and a single response tool. It removes Omega's general-purpose shell, file,
web, arbitrary-MeTTa, workflow, and external-delegation skills from the
model-callable catalogue.

## Current status

| Area | State |
| --- | --- |
| Python classroom adapter | Implemented; roster/pause checks, authenticated Omega WebSocket, correlated request/reply, explicit disconnected/timeout errors |
| Omega skills | Restricted MeTTa co-tutor plugin is implemented and its functions pass isolated MeTTa tests |
| Omega profile/image | Classroom plugin list, Groq provider profile, Dockerfile, and launcher are in this repository |
| Active Python reasoning | Removed; there is no Python rule base or atomizer |
| Actual Omega startup | Not verified here; this environment has no Docker command or importable Hyperon runtime |
| Groq tool-call contract | The synthetic direct smoke check was blocked by Groq's HTTP 403 (Cloudflare code 1010); the live Omega/Groq path is not verified |
| Real classroom use | Not approved; use synthetic, non-identifying messages only |

The MeTTa test harness stubs Omega's plugin-registration and channel functions.
Passing it verifies the skill logic, not the real Omega plugin loader. Likewise,
the HTTP tests use a fake WebSocket peer and do not claim a live LLM result.

## Groq key, not an OpenAI key

Omega's `OpenAIAPI` provider uses the OpenAI client library against a
configurable compatible endpoint. The classroom profile and launcher point it
to `https://api.groq.com/openai/v1/`. The launcher maps the Groq secret into
Omega's generic `OPENAIAPI_API_KEY` slot; the request goes to Groq. An OpenAI
API key is not needed or used.

## Run locally

### Prerequisites

- Python 3.11+
- Node.js and npm
- Docker
- The Omega source checkout used by the launcher (default `../Omega`)
- A Groq API key and two separate long random tokens

Install the API and frontend dependencies:

```sh
python -m venv .venv
.venv/bin/python -m pip install -e ".[dev]"
npm ci
```

Set these variables in the API and Omega-launcher environments. The same
`OMEGA_CHANNEL_TOKEN` must be used for the API-to-Omega WebSocket; keep the
separate `OMEGA_API_TOKEN` for HTTP callers:

```sh
openssl rand -hex 32
openssl rand -hex 32
export GROQ_API_KEY='<Groq key>'
export OMEGA_CHANNEL_TOKEN='<long random shared token>'
export OMEGA_API_TOKEN='<different long random API token>'
export OMEGA_ROOT='../Omega'
```

Copy the generated values to the root `.env` as well if you want the API and
smoke scripts to load them automatically; never commit that file.

The browser demo asks for `OMEGA_API_TOKEN` and holds it only in page memory.
Do not use the shared token as production user identity or authorization.

Build the classroom image. Use the same Omega release as the local
`$OMEGA_ROOT/scripts/omega` launcher:

```sh
docker build \
  --build-arg OMEGA_IMAGE=singularitynet/omega:v0.1.21 \
  -f Dockerfile.omega \
  -t omega-taa-classroom:local .
```

Start the API:

```sh
.venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

The bridge container needs host access, so the API binds to all interfaces.
Restrict port 8000 to the trusted development network with the host firewall;
do not expose it publicly.

Start the Omega container in another terminal:

```sh
sh ./scripts/run-omega-classroom.sh
```

Then start the teacher-facing demo and enter `OMEGA_API_TOKEN` when prompted:

```sh
npm run dev
```

Before Omega connects, `/api/health` reports `status: "degraded"` and
`omega_connected: false`; event requests explicitly fail rather than using a
stand-in implementation.

## API

Create a lesson:

```http
POST /api/lesson
Authorization: Bearer <OMEGA_API_TOKEN>
Content-Type: application/json

{
  "lesson_id": "lesson_001",
  "student_ids": ["stu_001"],
  "course": "CodeYetu AI Foundations",
  "lesson": "AI Foundations Day 01",
  "learning_objectives": [
    "Distinguish a fixed rule, a learned prediction, and a proposed agent action."
  ]
}
```

Send a synthetic event:

```http
POST /api/events
Authorization: Bearer <OMEGA_API_TOKEN>
Content-Type: application/json

{
  "student_id": "stu_001",
  "timestamp": "2026-11-12T10:00:00Z",
  "text": "What is the difference between a rule and a prediction?",
  "source": "chat"
}
```

`POST /api/events` returns Omega's response. Other routes:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Lesson and Omega connection status |
| `POST` | `/api/lesson` | Start/reset lesson and roster |
| `POST` | `/api/events` | Send a classroom event to Omega |
| `GET` | `/api/feed` | Read response-only turns held in process memory |
| `POST` | `/api/pause` | Block/unblock event forwarding |
| `WS` | `/api/omega` | Internal authenticated Omega channel |

## Data and safety limits

- Event text and lesson objectives are sent through Omega to the configured
  model provider (Groq in the supplied profile); use synthetic text only.
- Student roster references are validated by the API but are omitted, along
  with event timestamps, from the model context.
- The API does not retain event text, but Omega's stock loop persists
  conversation history in its memory directory. The supplied launcher also
  uses Omega's persistent memory volume. That behavior needs an explicit
  approved retention design before using any learner data.
- All HTTP API routes require a bearer token in `OMEGA_API_TOKEN`; the
  internal Omega WebSocket has a different `OMEGA_CHANNEL_TOKEN`.
- The API token is a shared development credential, not per-user identity or
  role-based authorization. Use a trusted TLS reverse proxy, identity-aware
  authorization, rate limits, and request-size limits before any wider
  deployment. Set `OMEGA_CORS_ORIGINS` and `OMEGA_ALLOWED_HOSTS` to the exact
  deployed origins and hostnames.
- No Jitsi, speech transcription, robot/sensor connection, student messaging,
  production teacher dashboard, or school/privacy approval is included.
- A restricted tool list does not guarantee correct or age-appropriate model
  output. Teacher evaluation, security review, privacy review, and operational
  controls are still required.

## Tests

```sh
make test
make test-metta
npm run build
```

`make test` covers the HTTP boundary and fake Omega channel. `make test-metta`
uses the local MeTTa CLI with stubs. The real Docker image, Omega/PeTTa plugin
startup, Groq tool call, and a live classroom exchange still need to be tested
on a machine with the required runtime.

On a Docker-capable machine, use `make omega-image`, start the API and
`scripts/run-omega-classroom.sh` in separate terminals, then run
`make omega-live-check`. `make groq-tool-check` separately sends a synthetic
strict-schema tool-call request directly to Groq; it does not test Omega's
provider integration. In this environment that direct request received HTTP
403 (Cloudflare code 1010), so credential validity and model compatibility
remain unconfirmed.

See [backend/README.md](./backend/README.md) for channel details and
[docs/OMEGA-TAA-NORTH-STAR.md](./docs/OMEGA-TAA-NORTH-STAR.md) for product
scope, source references, safety boundaries, and release gates.
