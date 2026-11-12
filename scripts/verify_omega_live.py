"""Verify one synthetic request through a running API and Omega/Groq runtime."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from uuid import uuid4

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env", override=False)


def request_json(url: str, api_token: str, payload: dict[str, object] | None = None) -> dict[str, object]:
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {api_token}",
            **({"Content-Type": "application/json"} if body is not None else {}),
        },
        method="POST" if body is not None else "GET",
    )
    try:
        with urlopen(request, timeout=180) as response:
            result = json.loads(response.read())
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"API request failed with HTTP {error.code}: {detail}") from error
    except (TimeoutError, URLError) as error:
        raise RuntimeError(f"API is not reachable: {error}") from error
    if not isinstance(result, dict):
        raise RuntimeError("API returned a non-object JSON response.")
    return result


def main() -> int:
    api_token = os.getenv("OMEGA_API_TOKEN", "").strip()
    if not api_token:
        raise RuntimeError("OMEGA_API_TOKEN is required; set it in .env or the environment.")

    base_url = os.getenv("OMEGA_API_URL", "http://127.0.0.1:8000").rstrip("/")
    health = request_json(f"{base_url}/api/health", api_token)
    if health.get("omega_connected") is not True:
        raise RuntimeError(
            "Omega is not connected. Start the API and classroom Omega container first."
        )

    lesson_id = f"cto-smoke-{uuid4().hex[:12]}"
    request_json(
        f"{base_url}/api/lesson",
        api_token,
        {
            "lesson_id": lesson_id,
            "student_ids": ["synthetic_learner"],
            "course": "CodeYetu AI Foundations",
            "lesson": "AI Foundations Day 01",
            "learning_objectives": [
                "Distinguish a fixed rule, a learned prediction, and a proposed agent action.",
                "Explain why a prediction is not permission to act.",
            ],
        },
    )
    result = request_json(
        f"{base_url}/api/events",
        api_token,
        {
            "student_id": "synthetic_learner",
            "timestamp": "2026-11-12T12:00:00Z",
            "text": "In one or two sentences, explain why a prediction is not permission to act.",
            "source": "chat",
        },
    )
    response_text = result.get("response")
    if (
        result.get("runtime") != "Omega/PeTTa"
        or result.get("lesson_id") != lesson_id
        or not isinstance(response_text, str)
        or not response_text.strip()
    ):
        raise RuntimeError("The live request returned an invalid Omega response shape.")

    print("PASS: authenticated synthetic request received a non-empty Omega/PeTTa response.")
    print(f"Response: {response_text}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1) from error
