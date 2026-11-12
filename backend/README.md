# Omega Classroom Co-Tutor

The backend is a transport adapter, not an agent or reasoner. It validates the
lesson roster and pause state, forwards each event to the live Omega/PeTTa
runtime over an authenticated WebSocket, and returns Omega's response. There
is no Python atomizer, tutoring rule, inference engine, or offline fallback.

## Architecture

```text
Teacher demo / classroom caller
    → FastAPI lesson, roster, and pause boundary
    → request-correlated, token-authenticated WebSocket
    → Omega agent loop (PeTTa / MeTTa)
    → OpenAI-compatible Omega provider pointed at Groq
    → restricted CodeYetu co-tutor MeTTa skills
    → response through the same WebSocket and HTTP request
```

The classroom Omega image uses only the WebSocket channel plugin, Omega's
`OpenAIAPI` provider, and `backend/metta/skills.metta`. The co-tutor plugin
removes the default general-purpose tool skills and exposes lesson explanations,
hints, bounded answer checks, curriculum checks, a follow-up question, and one
learner-response tool.

## Configuration and run

The API loads the root `.env` file. Set:

```dotenv
GROQ_API_KEY=<Groq key>
OMEGA_CHANNEL_TOKEN=<long random shared token>
OMEGA_API_TOKEN=<different long random API token>
OMEGA_REPLY_TIMEOUT_SECONDS=120
OMEGA_CORS_ORIGINS=http://localhost:5173
OMEGA_ALLOWED_HOSTS=localhost,127.0.0.1,host.docker.internal
```

Generate the two tokens independently (for example with `openssl rand -hex
32`). Enter `OMEGA_API_TOKEN` in the browser demo; it remains in page memory.
The API rejects HTTP requests if this token is unset and returns 401 for a
missing or invalid bearer token. The channel token is not accepted for HTTP.

Use the same `OMEGA_CHANNEL_TOKEN` when launching Omega. The Omega launcher
maps `GROQ_API_KEY` to the generic `OPENAIAPI_API_KEY` environment slot because
its OpenAI-compatible provider reads that slot by default; requests still go
to Groq's endpoint, and an OpenAI API key is neither required nor used.

Build the classroom image from an Omega release that matches the `scripts/omega`
launcher in the local Omega checkout:

```sh
docker build \
  --build-arg OMEGA_IMAGE=singularitynet/omega:v0.1.21 \
  -f Dockerfile.omega \
  -t omega-taa-classroom:local .
```

Start the API on the local interface for browser-only access:

```sh
.venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

In another terminal, with `GROQ_API_KEY` and `OMEGA_CHANNEL_TOKEN` exported,
launch the runtime:

```sh
OMEGA_ROOT=/path/to/AGI/Omega sh ./scripts/run-omega-classroom.sh
```

The launcher defaults to `../Omega` and `ws://host.docker.internal:8000/api/omega`.
It starts the custom image through Omega's own `scripts/omega` launcher. Start
the frontend separately with `npm run dev`. The API remains degraded and
rejects tutoring requests until the authenticated Omega channel connects.
Binding to `0.0.0.0` is required for a bridge container to reach the host;
restrict access with the host firewall and do not expose the port publicly.

To run only the HTTP service without an Omega runtime, set up the Python
environment and start Uvicorn as above. `/api/health` reports the disconnected
runtime; `/api/events` returns HTTP 503 rather than using a fallback.

## HTTP API

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

The response contains the `event_id`, `lesson_id`, Omega response, and
`runtime: "Omega/PeTTa"`. The event text is forwarded to Omega and its
configured model provider. The roster is checked at the API boundary, but
`student_id` and `timestamp` are omitted from the model context. The API feed
retains response text in process memory, but does not store the submitted event
text.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Report lesson and live Omega channel status |
| `POST` | `/api/lesson` | Start/reset a lesson roster and curriculum context |
| `POST` | `/api/events` | Forward one event to Omega and return its reply |
| `GET` | `/api/feed` | Read response-only turns for the active process |
| `POST` | `/api/pause` | Block/unblock event forwarding |
| `WS` | `/api/omega` | Authenticated internal channel for the Omega runtime |

Expected failures are explicit: HTTP 409 for no active lesson or a paused
agent, 401 for missing/invalid HTTP bearer credentials, 422 for a student
outside the roster, 503 when Omega is disconnected or `OMEGA_API_TOKEN` is
unset, 504 on an Omega response timeout, and 502 for a malformed Omega reply.

## Verification

```sh
make test
make test-metta
npm run build
```

The Python tests exercise the HTTP boundary and a request-correlated fake
channel. The MeTTa tests exercise skill functions with stubs for Omega's
registration and channel functions. Neither substitutes for building and
running the actual Omega image. End-to-end Omega startup, Groq tool-call
compatibility, and a live classroom exchange still need to be verified on a
machine with Docker and the matching Omega runtime.

After building and starting the image and API on a Docker-capable machine,
run `make omega-live-check` to send one synthetic lesson question through the
authenticated API, Omega tool loop, and Groq provider. `make groq-tool-check`
tests only Groq's strict-schema function-call endpoint and is not an Omega
integration test. In the current environment it returned HTTP 403 (Cloudflare
code 1010), so live provider compatibility remains unverified.

## Safety and current limitations

- Use synthetic text only. Groq receives the learner message through Omega.
- Omega's stock loop writes conversation history to its memory directory, and
  the standard launcher mounts a persistent memory volume. That behavior must
  be disabled or given an explicitly approved retention design before using
  real learner data.
- Every HTTP endpoint requires the `OMEGA_API_TOKEN` bearer credential. This is
  shared-token authentication only, not user identity or role-based access.
- CORS and trusted-host allowlists are configurable; keep them exact. For
  deployment, add TLS, identity-aware authorization, proxy-level rate and body
  limits, and network restrictions. Do not expose the development API directly
  to the internet.
- The browser demo is not a production teacher dashboard. There is no
  authentication, Jitsi/audio integration, durable classroom audit, student
  messaging adapter, or school/privacy approval.
- The profile restricts model-callable skills but does not establish that
  model responses are pedagogically correct. Evaluate lesson outcomes and
  failure cases with teachers before any pilot.
